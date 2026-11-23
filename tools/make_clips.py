"""Нарезка клипов «скачать момент» (23.11.2026).
Для каждой игры с готовым смонтированным роликом пишет .bat, который на компьютере пользователя режет каждый эпизод
в отдельный mp4 (720p, ~10–15 с): Desktop\\Baseball_games\\clips\\<id>\\<id>_NNN.mp4 (NNN — номер розыгрыша n в g.plays).
Время в ролике = время эпизода в монтаже + OFF (заставка). Клип: от конца предыдущего эпизода (но не больше 14 с) до конца эпизода + 1.2 с."""
import json,os
ROOT=r'C:\Users\Administrator\Desktop\Baseball_games'
GAMES={
 '2026-11-15':dict(ev='/home/claude/g1511/events.json',off=5.3,src=ROOT+r'\Game 15.11.2026\Gilavar Baku vs Bina Warriors - Condensed Game 15.11.2026.mp4'),
 '2026-11-22':dict(ev='/home/claude/g2211/events.json',off=5.3,src=ROOT+r'\Game 22.11.2026\Gilavar Baku vs Bina Warriors - Condensed Game 22.11.2026.mp4'),
}
os.makedirs('/mnt/user-data/outputs/clips',exist_ok=True)
for gid,c in GAMES.items():
    g=json.load(open(f'data/games/{gid}.json')); E=json.load(open(c['ev']))['events']
    P=[x for x in g['plays'] if x.get('t') is not None]; assert len(P)==len(E)
    L=['@echo off','chcp 65001 >nul',f'set "SRC={c["src"]}"',f'set "OUT={ROOT}\\clips\\{gid}"','if not exist "%OUT%" mkdir "%OUT%"',
       f'echo Нарезка {len(P)} клипов игры {gid}. Это займёт 5-15 минут, не закрывайте окно.','echo.']
    prev=None
    for x,e in zip(P,E):
        end=e['t']+1.2; st=e['t']-14 if prev is None else max(e['t']-14,prev-0.4)
        prev=e['t']; a=st+c['off']; d=end-st
        fn=f'{gid}_{x["n"]:03d}.mp4'
        L.append(f'if not exist "%OUT%\\{fn}" ffmpeg -hide_banner -loglevel error -y -ss {a:.2f} -i "%SRC%" -t {d:.2f} -vf "scale=-2:720,fps=30" -c:v libx264 -preset veryfast -crf 27 -c:a aac -b:a 96k -movflags +faststart "%OUT%\\{fn}" && echo {fn}')
    L+=['echo.','echo ГОТОВО. Теперь запустите 06_upload_clips.bat в папке Baseball_games.','pause']
    open(f'/mnt/user-data/outputs/clips/05_clips_{gid}.bat','w',encoding='utf-8',newline='\r\n').write('\n'.join(L)+'\n')
    print(gid,len(P))
