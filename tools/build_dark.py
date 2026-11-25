#!/usr/bin/env python3
"""Собирает dark.css — тёмные цвета поверх light.css (25.11.2026).

Идея: светлая тема (light.css) задаёт и цвета, и форму (шрифты, размеры, рамки, кнопки).
Раньше тёмная тема просто отключала light.css, и вместе с цветами менялась форма элементов.
Теперь light.css работает всегда, а dark.css (только под html.theme-dark) меняет ТОЛЬКО цвета:
  * берём из light.css каждое объявление, где есть цвет;
  * если в theme.css (старая тёмная тема) у того же селектора то же свойство — берём тёмный цвет оттуда;
  * иначе переводим цвет: цвета палитры светлой темы → цвета палитры тёмной, остальные — «переворачиваем» яркость.
Запуск после правок light.css:  python3 tools/build_dark.py
"""
import re, colorsys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rd = lambda f: open(os.path.join(ROOT, f), encoding='utf-8').read()

def strip_comments(s): return re.sub(r'/\*.*?\*/', '', s, flags=re.S)

def parse(s):
    """[(selector|None, [decl...] | children, at)] — простой разбор CSS с одним уровнем @media."""
    out, i, n = [], 0, len(s)
    while i < n:
        j = s.find('{', i)
        if j < 0: break
        head = s[i:j].strip()
        depth, k = 1, j + 1
        while k < n and depth:
            if s[k] == '{': depth += 1
            elif s[k] == '}': depth -= 1
            k += 1
        body = s[j+1:k-1]
        if head.startswith('@media') or head.startswith('@supports'):
            out.append((head, parse(body), True))
        elif head.startswith('@'):
            pass  # @keyframes и т.п. — не трогаем
        else:
            decls = []
            for d in re.split(r';(?![^(]*\))', body):
                if ':' in d:
                    p, v = d.split(':', 1); decls.append((p.strip(), v.strip()))
            out.append((head, decls, False))
        i = k
    return out

COLOR_RE = re.compile(r'#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\b(?:white|black)\b')
COLOR_PROPS = re.compile(r'^(color|background(-color|-image)?|border(-top|-right|-bottom|-left)?(-color)?|outline(-color)?|box-shadow|text-shadow|fill|stroke|caret-color|accent-color|text-decoration-color|--[\w-]+|filter|color-scheme)$')

def norm_sel(s): return re.sub(r'\s+', ' ', s.strip())

def to_rgb(c):
    c = c.strip().lower()
    if c == 'white': return (255, 255, 255, 1)
    if c == 'black': return (0, 0, 0, 1)
    if c.startswith('#'):
        h = c[1:]
        if len(h) in (3, 4): h = ''.join(x*2 for x in h)
        r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
        a = int(h[6:8], 16)/255 if len(h) == 8 else 1
        return (r, g, b, a)
    m = re.match(r'rgba?\(([^)]*)\)', c)
    if m:
        p = [x.strip() for x in re.split(r'[ ,/]+', m.group(1)) if x.strip()]
        if any('var(' in x for x in p) or len(p) < 3: return None
        r, g, b = [float(x.rstrip('%')) for x in p[:3]]
        a = float(p[3]) if len(p) > 3 else 1
        return (r, g, b, a)
    return None

def fmt(r, g, b, a):
    r, g, b = [max(0, min(255, round(x))) for x in (r, g, b)]
    return f'#{r:02X}{g:02X}{b:02X}' if a >= 0.999 else f'rgba({r},{g},{b},{round(a, 3)})'

# палитра: светлая → тёмная (значения из :root light.css и theme.css)
PAL = {
    '#F2F5FA': '#070D18', '#FFFFFF': '#0E1A2C', '#EBF0F7': '#15233A', '#D9E1EC': '#1B2B45', '#10233F': '#EEF2F8',
    '#55657D': '#93A3BB', '#66758C': '#6F819C', '#E6EEFB': '#16294A', '#2C3F5C': '#C9D4E5', '#F4F7FC': '#13213A',
    '#EEF3FA': '#15233A', '#E2E9F3': '#1F3050', '#D5DEEA': '#2A3D5E', '#5B6B82': '#93A3BB', '#C9D8F2': '#24406E',
}
def conv_color(tok):
    rgb = to_rgb(tok)
    if not rgb: return tok
    r, g, b, a = rgb
    key = fmt(r, g, b, 1)
    if key in PAL:
        rr, gg, bb, _ = to_rgb(PAL[key]); return fmt(rr, gg, bb, a)
    h, l, s = colorsys.rgb_to_hls(r/255, g/255, b/255)
    if s > 0.35 and 0.25 < l < 0.65:      # насыщенные акценты (зелёный, красный, синий) — чуть светлее
        l = min(0.72, l + 0.12)
    else:                                   # фоны, текст, серые — переворачиваем яркость
        l = 0.06 + (1 - l) * 0.86
    rr, gg, bb = colorsys.hls_to_rgb(h, l, s)
    return fmt(rr*255, gg*255, bb*255, a)

def conv_value(v, p=''):
    def one(tok):
        rgb = to_rgb(tok)
        if rgb and p in ('box-shadow', 'text-shadow', 'filter'):      # тени остаются тёмными
            return fmt(0, 0, 0, min(1, rgb[3]*1.6)) if rgb[0]+rgb[1]+rgb[2] < 400 else tok
        if rgb and p == 'color' and rgb[0] > 245 and rgb[1] > 245 and rgb[2] > 245:  # белый текст (на цветных кнопках) — белым и остаётся
            return tok
        return conv_color(tok)
    return COLOR_RE.sub(lambda m: one(m.group(0)), v)

def dark_sel(sel):
    parts = []
    for s in sel.split(','):
        s = s.strip()
        if s.startswith(':root'): s = 'html.theme-dark' + s[5:]
        elif s.startswith('html:not(.theme-dark)'): continue
        elif s.startswith('html'): s = re.sub(r'^html', 'html.theme-dark', s, count=1)
        else: s = 'html.theme-dark ' + s
        parts.append(s)
    return ', '.join(parts)

theme = parse(strip_comments(rd('theme.css')))
TMAP = {}
def index(rules, at=None):
    for head, body, is_at in rules:
        if is_at: index(body, head); continue
        for s in head.split(','):
            for p, v in body: TMAP[(at, norm_sel(s), p)] = v
index(theme)

def build(rules, at=None):
    out = []
    for head, body, is_at in rules:
        if is_at:
            inner = build(body, head)
            if inner: out.append(f'{head}{{\n' + '\n'.join('  '+x for x in inner) + '\n}')
            continue
        sel = dark_sel(head)
        if not sel: continue
        decls = []
        for p, v in body:
            if not COLOR_PROPS.match(p): continue
            if p == 'color-scheme': decls.append('color-scheme:dark'); continue
            if not COLOR_RE.search(v) and p != 'filter': continue
            if p == 'filter' and not COLOR_RE.search(v): continue
            sels = [norm_sel(s) for s in head.split(',')]
            tv = next((TMAP.get((at, s, p)) for s in sels if TMAP.get((at, s, p))), None)
            if tv is not None and COLOR_RE.search(tv): val = tv
            else: val = conv_value(v, p)
            if '!important' in v and '!important' not in val: val += '!important'
            if val != v or tv is not None: decls.append(f'{p}:{val}')
        if decls: out.append(f'{sel}{{' + ';'.join(decls) + '}')
    return out

light = parse(strip_comments(rd('light.css')))
res = build(light)
hdr = ('/* dark.css — СОБРАНО АВТОМАТИЧЕСКИ из light.css + theme.css скриптом tools/build_dark.py, руками не править.\n'
       '   Тёмная тема меняет только цвета; форма элементов (шрифты, размеры, кнопки) — из light.css, одинаковая в обеих темах. */\n')
open(os.path.join(ROOT, 'dark.css'), 'w', encoding='utf-8').write(hdr + '\n'.join(res) + '\n')
print(len(res), 'rules')
