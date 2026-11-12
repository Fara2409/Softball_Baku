-- =====================================================================
-- Softball Baku — база данных Supabase
-- Запуск: Supabase → SQL Editor → New query → вставить ВЕСЬ файл → Run.
-- Повторный запуск безопасен (ничего не удаляет из данных).
--
-- Роли:
--   (без входа)  зритель: смотрит сайт и онлайн-счёт
--   guest        зарегистрированный гость: + комментарии
--   player       игрок (подтверждает админ): + «буду / не буду»
--   admin        организатор: расписание, подтверждение игроков, онлайн-счёт
-- =====================================================================

-- ---------- 1. Профили и роли ----------
create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  display_name        text not null default '',
  role                text not null default 'guest' check (role in ('guest','player','admin')),
  player_id           text unique,          -- id из data/players.json, ставит только админ
  requested_player_id text,                 -- «я игрок #24» — заявка, которую подтверждает админ
  created_at          timestamptz not null default now()
);

create or replace function public.my_role() returns text
language sql stable security definer set search_path = public as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'anon')
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select public.my_role() = 'admin'
$$;

-- новый пользователь → профиль гостя
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, requested_player_id)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'display_name',''),
             nullif(new.raw_user_meta_data->>'full_name',''),
             split_part(coalesce(new.email,''),'@',1)),
    nullif(new.raw_user_meta_data->>'requested_player_id','')
  )
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- пользователь не может сам поменять себе роль или привязку к игроку
-- (из SQL Editor, где auth.uid() пустой, — можно: так назначается первый админ)
create or replace function public.protect_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role      := old.role;
    new.player_id := old.player_id;
  end if;
  return new;
end $$;
drop trigger if exists protect_profile on public.profiles;
create trigger protect_profile before update on public.profiles
  for each row execute function public.protect_profile();

alter table public.profiles enable row level security;
drop policy if exists "profiles: читать всем" on public.profiles;
create policy "profiles: читать всем" on public.profiles for select using (true);
drop policy if exists "profiles: менять свой или админ" on public.profiles;
create policy "profiles: менять свой или админ" on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- ---------- 2. Расписание игр ----------
create table if not exists public.events (
  id         bigint generated always as identity primary key,
  starts_at  timestamptz not null,
  place      text not null default 'Əmircan',
  note       text not null default '',
  status     text not null default 'planned' check (status in ('planned','cancelled','done')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.events enable row level security;
drop policy if exists "events: читать всем" on public.events;
create policy "events: читать всем" on public.events for select using (true);
drop policy if exists "events: менять админу" on public.events;
create policy "events: менять админу" on public.events for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- 3. «Буду / не буду» ----------
create table if not exists public.rsvps (
  event_id   bigint not null references public.events(id) on delete cascade,
  user_id    uuid   not null references public.profiles(id) on delete cascade,
  status     text   not null check (status in ('yes','no','maybe')),
  updated_at timestamptz not null default now(),
  primary key (event_id, user_id)
);
alter table public.rsvps enable row level security;
drop policy if exists "rsvps: читать всем" on public.rsvps;
create policy "rsvps: читать всем" on public.rsvps for select using (true);
drop policy if exists "rsvps: игрок отмечает себя" on public.rsvps;
create policy "rsvps: игрок отмечает себя" on public.rsvps for insert
  with check ((auth.uid() = user_id and public.my_role() in ('player','admin')) or public.is_admin());
drop policy if exists "rsvps: игрок меняет свою отметку" on public.rsvps;
create policy "rsvps: игрок меняет свою отметку" on public.rsvps for update
  using ((auth.uid() = user_id and public.my_role() in ('player','admin')) or public.is_admin())
  with check ((auth.uid() = user_id) or public.is_admin());
drop policy if exists "rsvps: удалить свою или админ" on public.rsvps;
create policy "rsvps: удалить свою или админ" on public.rsvps for delete
  using (auth.uid() = user_id or public.is_admin());

-- ---------- 4. Онлайн-счёт ----------
create table if not exists public.live_games (
  id         text primary key,                      -- дата игры ГГГГ-ММ-ДД
  status     text not null default 'live' check (status in ('live','final')),
  data       jsonb not null default '{}'::jsonb,    -- команды, счёт, иннинг, ауты, базы, бэттер, последние розыгрыши
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);
alter table public.live_games enable row level security;
drop policy if exists "live: читать всем" on public.live_games;
create policy "live: читать всем" on public.live_games for select using (true);
drop policy if exists "live: вести счёт админу" on public.live_games;
create policy "live: вести счёт админу" on public.live_games for all
  using (public.is_admin()) with check (public.is_admin());
-- мгновенные обновления у зрителей (Realtime)
do $$ begin
  alter publication supabase_realtime add table public.live_games;
exception when duplicate_object then null; end $$;

-- ---------- 5. Комментарии (для следующего шага) ----------
create table if not exists public.comments (
  id         bigint generated always as identity primary key,
  target     text not null,      -- 'game:2026-11-01', 'player:farhad-eyvazov', 'live:2027-01-03'
  user_id    uuid not null references public.profiles(id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists comments_target_idx on public.comments(target, created_at);
alter table public.comments enable row level security;
drop policy if exists "comments: читать всем" on public.comments;
create policy "comments: читать всем" on public.comments for select using (true);
drop policy if exists "comments: писать зарегистрированным" on public.comments;
create policy "comments: писать зарегистрированным" on public.comments for insert
  with check (auth.uid() = user_id and public.my_role() in ('guest','player','admin'));
drop policy if exists "comments: удалить свой или админ" on public.comments;
create policy "comments: удалить свой или админ" on public.comments for delete
  using (auth.uid() = user_id or public.is_admin());

-- ---------- 6. Админ: список участников и сброс пароля ----------
-- Пароли хранятся только как хеш — увидеть их нельзя никому.
-- Если участник забыл пароль, админ задаёт ему временный, а тот меняет его в профиле.
create extension if not exists pgcrypto with schema extensions;

create or replace function public.admin_users()
returns table (id uuid, email text, display_name text, role text, player_id text,
               requested_player_id text, created_at timestamptz, last_sign_in_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Только для админа'; end if;
  return query
    select u.id, u.email::text, p.display_name, p.role, p.player_id,
           p.requested_player_id, u.created_at, u.last_sign_in_at
    from auth.users u join public.profiles p on p.id = u.id
    order by u.created_at desc;
end $$;

create or replace function public.admin_reset_password(target uuid, new_password text)
returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Только для админа'; end if;
  if char_length(coalesce(new_password,'')) < 6 then raise exception 'Пароль короче 6 символов'; end if;
  update auth.users
     set encrypted_password = extensions.crypt(new_password, extensions.gen_salt('bf')),
         updated_at = now()
   where auth.users.id = target;
  if not found then raise exception 'Пользователь не найден'; end if;
end $$;

-- ---------- 6b. Админ: исправить почту участника (12.11.2026) ----------
-- Например, человек ошибся при регистрации (…@olimpes.sz вместо …@olimpes.az).
-- Меняем адрес и в auth.users, и в auth.identities (вход по почте), сразу подтверждённым.
create or replace function public.admin_set_email(target uuid, new_email text)
returns void
language plpgsql security definer set search_path = '' as $$
declare e text := lower(trim(coalesce(new_email,'')));
begin
  if not public.is_admin() then raise exception 'Только для админа'; end if;
  if e !~ '^[^@\s]+@[^@\s]+\.[a-z]{2,}$' then raise exception 'Неверный адрес почты'; end if;
  if exists (select 1 from auth.users where lower(email) = e and id <> target) then
    raise exception 'Эта почта уже занята другим участником'; end if;
  update auth.users
     set email = e, email_confirmed_at = coalesce(email_confirmed_at, now()),
         email_change = '', email_change_token_new = '', updated_at = now()
   where id = target;
  if not found then raise exception 'Пользователь не найден'; end if;
  update auth.identities
     set identity_data = jsonb_set(identity_data, '{email}', to_jsonb(e)), updated_at = now()
   where user_id = target and provider = 'email';
end $$;

-- ---------- 7. Доступ сайта к таблицам ----------
-- С 30.05.2026 Supabase в новых проектах не открывает таблицы автоматически —
-- выдаём права явно. Что именно разрешено каждому — решают политики RLS выше.
grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.events, public.rsvps, public.live_games, public.comments
  to anon, authenticated;
grant update on public.profiles to authenticated;
grant insert, update, delete on public.events, public.rsvps, public.live_games to authenticated;
grant insert, delete on public.comments to authenticated;
grant usage, select on all sequences in schema public to authenticated;

revoke execute on function public.admin_users(), public.admin_reset_password(uuid, text), public.admin_set_email(uuid, text) from public, anon;
grant execute on function public.my_role(), public.is_admin() to anon, authenticated;
grant execute on function public.admin_users(), public.admin_reset_password(uuid, text), public.admin_set_email(uuid, text) to authenticated;

-- =====================================================================
-- ПОСЛЕ ТОГО, КАК ВЫ ЗАРЕГИСТРИРУЕТЕСЬ НА САЙТЕ — сделать себя админом
-- (вписать свою почту и запустить только эту строку):
--
-- update public.profiles set role = 'admin', player_id = 'farhad-eyvazov'
--   where id = (select id from auth.users where email = 'ВАША_ПОЧТА');
-- =====================================================================
