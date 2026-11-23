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

-- ---------- 6c. Кто заходил на сайт (12.11.2026) ----------
-- Когда участник под своим аккаунтом открывает сайт или приложение, сайт вызывает touch_seen()
-- (не чаще раза в 5 минут). Таблицу никто не читает напрямую — только админ через admin_users().
create table if not exists public.last_seen (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  seen_at  timestamptz not null default now(),
  visits   integer not null default 1        -- визиты: новый, если с прошлого прошло больше 30 минут
);
alter table public.last_seen enable row level security;   -- политик нет: напрямую не читается и не пишется

create or replace function public.touch_seen()
returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then return; end if;
  insert into public.last_seen as s (user_id, seen_at, visits) values (auth.uid(), now(), 1)
  on conflict (user_id) do update
    set visits  = s.visits + case when s.seen_at < now() - interval '30 minutes' then 1 else 0 end,
        seen_at = now();
end $$;

drop function if exists public.admin_users();
create or replace function public.admin_users()
returns table (id uuid, email text, display_name text, role text, player_id text,
               requested_player_id text, created_at timestamptz, last_sign_in_at timestamptz,
               last_seen_at timestamptz, visits integer)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Только для админа'; end if;
  return query
    select u.id, u.email::text, p.display_name, p.role, p.player_id,
           p.requested_player_id, u.created_at, u.last_sign_in_at, s.seen_at, s.visits
    from auth.users u join public.profiles p on p.id = u.id
    left join public.last_seen s on s.user_id = u.id
    order by coalesce(s.seen_at, u.last_sign_in_at, u.created_at) desc;
end $$;

-- ---------- 6d. Голосование «Игрок матча» среди игроков (16.11.2026) ----------
-- Админ создаёт голосование на дату игры и отмечает, кто был на игре (attendees — id игроков из players.json).
-- Голосуют только игроки (role player/admin с привязкой к игроку), которые были на игре; за себя нельзя;
-- один голос на игру, пока голосование открыто — голос можно поменять. Итоги видны после закрытия (админу — сразу).
create table if not exists public.mvp_polls (
  game_id    text primary key,                       -- дата игры ГГГГ-ММ-ДД (как id игры на сайте)
  attendees  text[] not null default '{}',
  status     text not null default 'open' check (status in ('open','closed')),
  created_at timestamptz not null default now(),
  closed_at  timestamptz
);
create table if not exists public.mvp_votes (
  game_id      text not null references public.mvp_polls(game_id) on delete cascade,
  voter        uuid not null default auth.uid() references auth.users(id) on delete cascade,
  voter_player text not null,
  candidate    text not null,
  created_at   timestamptz not null default now(),
  primary key (game_id, voter)
);
alter table public.mvp_polls enable row level security;
alter table public.mvp_votes enable row level security;
drop policy if exists mvp_polls_read on public.mvp_polls;
create policy mvp_polls_read on public.mvp_polls for select using (true);
drop policy if exists mvp_polls_admin on public.mvp_polls;
create policy mvp_polls_admin on public.mvp_polls for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists mvp_votes_own on public.mvp_votes;
create policy mvp_votes_own on public.mvp_votes for select using (voter = auth.uid() or public.is_admin());
-- голоса пишутся только через функцию с проверками (прямой insert запрещён — политики на insert нет)
create or replace function public.cast_mvp_vote(p_game text, p_candidate text) returns void
language plpgsql security definer set search_path = public as $$
declare me text; pl public.mvp_polls;
begin
  select player_id into me from public.profiles where id = auth.uid() and role in ('player','admin');
  if me is null then raise exception 'mvp_not_player'; end if;
  select * into pl from public.mvp_polls where game_id = p_game;
  if pl.game_id is null or pl.status <> 'open' then raise exception 'mvp_closed'; end if;
  if not (me = any(pl.attendees)) then raise exception 'mvp_not_attendee'; end if;
  if not (p_candidate = any(pl.attendees)) then raise exception 'mvp_bad_candidate'; end if;
  if p_candidate = me then raise exception 'mvp_self'; end if;
  insert into public.mvp_votes(game_id, voter, voter_player, candidate) values (p_game, auth.uid(), me, p_candidate)
  on conflict (game_id, voter) do update set candidate = excluded.candidate, created_at = now();
end $$;
-- итоги: всем — после закрытия, админу — всегда; total — сколько всего голосов
create or replace function public.mvp_results(p_game text) returns table(candidate text, votes int)
language sql stable security definer set search_path = public as $$
  select v.candidate, count(*)::int from public.mvp_votes v join public.mvp_polls p on p.game_id = v.game_id
  where v.game_id = p_game and (p.status = 'closed' or public.is_admin())
  group by v.candidate order by 2 desc, 1
$$;
create or replace function public.mvp_count(p_game text) returns int
language sql stable security definer set search_path = public as $$
  select count(*)::int from public.mvp_votes where game_id = p_game
$$;
grant select on public.mvp_polls to anon, authenticated;
grant insert, update, delete on public.mvp_polls to authenticated;
grant select on public.mvp_votes to authenticated;
revoke execute on function public.cast_mvp_vote(text, text) from public, anon;
grant execute on function public.cast_mvp_vote(text, text) to authenticated;
grant execute on function public.mvp_results(text), public.mvp_count(text) to anon, authenticated;

-- ---------- 6e. Админ: удалить аккаунт (18.11.2026) ----------
-- Нужно, когда человек сначала зарегистрировался по почте, а потом вошёл через Google — остаётся лишний старый аккаунт.
-- Удаляется пользователь в auth.users; вместе с ним (on delete cascade) — профиль, отметки «буду», комментарии,
-- голоса и отметка «был на сайте»; в расписании created_by станет пустым. Себя и админов удалить нельзя.
create or replace function public.admin_delete_user(target uuid)
returns void
language plpgsql security definer set search_path = '' as $$
declare r text;
begin
  if not public.is_admin() then raise exception 'Только для админа'; end if;
  if target = auth.uid() then raise exception 'Нельзя удалить свой аккаунт'; end if;
  select p.role into r from public.profiles p where p.id = target;
  if r = 'admin' then raise exception 'Нельзя удалить админа — сначала смените роль'; end if;
  delete from auth.users where auth.users.id = target;
  if not found then raise exception 'Пользователь не найден'; end if;
end $$;
revoke execute on function public.admin_delete_user(uuid) from public, anon;
grant execute on function public.admin_delete_user(uuid) to authenticated;

-- ---------- 6f. Дни рождения (19.11.2026) ----------
-- Каждый пользователь указывает день и месяц рождения (без года): при регистрации, при первом входе через Google или в профиле.
-- Даты не читаются публично: сайт спрашивает только «у кого день рождения сегодня» — функция birthdays_on.
create table if not exists public.birthdays (
  user_id    uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  md         text not null check (md ~ '^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$'),  -- ММ-ДД
  updated_at timestamptz not null default now()
);
alter table public.birthdays enable row level security;
drop policy if exists birthdays_own_read on public.birthdays;
create policy birthdays_own_read on public.birthdays for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists birthdays_own_ins on public.birthdays;
create policy birthdays_own_ins on public.birthdays for insert with check (user_id = auth.uid());
drop policy if exists birthdays_own_upd on public.birthdays;
create policy birthdays_own_upd on public.birthdays for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists birthdays_own_del on public.birthdays;
create policy birthdays_own_del on public.birthdays for delete using (user_id = auth.uid() or public.is_admin());
create or replace function public.birthdays_on(p_md text) returns table(player_id text, display_name text)
language sql stable security definer set search_path = public as $$
  select p.player_id, p.display_name from public.birthdays b join public.profiles p on p.id = b.user_id where b.md = p_md
$$;
grant select, insert, update, delete on public.birthdays to authenticated;
grant execute on function public.birthdays_on(text) to anon, authenticated;
-- регистрация по почте: дата из формы приходит в raw_user_meta_data.birthday — сохраняем сразу
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
  if coalesce(new.raw_user_meta_data->>'birthday','') ~ '^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$' then
    insert into public.birthdays (user_id, md) values (new.id, new.raw_user_meta_data->>'birthday') on conflict (user_id) do nothing;
  end if;
  return new;
end $$;

-- ---------- 6g. Голосование за составы (20.11.2026) ----------
-- Админ предлагает варианты деления на составы (options — массив вариантов: {"A":[[id,поз],...],"B":[...],"sa":bool,"sb":bool})
-- и отмечает игроков, которые голосуют (voters — id игроков из players.json). Один голос на человека, голос можно менять.
-- Как только за вариант больше половины голосующих — он побеждает, голосование закрывается само.
-- Админ может закрыть вручную, утвердив любой вариант (например, при ничьей).
create table if not exists public.lineup_polls (
  id         bigint generated always as identity primary key,
  game_date  date not null,
  title      text,
  options    jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) between 2 and 6),
  voters     text[] not null default '{}',
  status     text not null default 'open' check (status in ('open','closed')),
  winner     int,
  created_at timestamptz not null default now(),
  closed_at  timestamptz
);
create table if not exists public.lineup_votes (
  poll_id      bigint not null references public.lineup_polls(id) on delete cascade,
  voter        uuid not null default auth.uid() references auth.users(id) on delete cascade,
  voter_player text not null,
  choice       int not null,
  created_at   timestamptz not null default now(),
  primary key (poll_id, voter)
);
alter table public.lineup_polls enable row level security;
alter table public.lineup_votes enable row level security;
drop policy if exists lineup_polls_read on public.lineup_polls;
create policy lineup_polls_read on public.lineup_polls for select using (true);
drop policy if exists lineup_polls_admin on public.lineup_polls;
create policy lineup_polls_admin on public.lineup_polls for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists lineup_votes_own on public.lineup_votes;
create policy lineup_votes_own on public.lineup_votes for select using (voter = auth.uid() or public.is_admin());
-- голос — только через функцию с проверками; при большинстве (> половины голосующих) голосование закрывается само
create or replace function public.cast_lineup_vote(p_poll bigint, p_choice int) returns json
language plpgsql security definer set search_path = public as $$
declare me text; pl public.lineup_polls; n int;
begin
  select player_id into me from public.profiles where id = auth.uid() and role in ('player','admin');
  if me is null then raise exception 'lp_not_player'; end if;
  select * into pl from public.lineup_polls where id = p_poll for update;
  if pl.id is null or pl.status <> 'open' then raise exception 'lp_closed'; end if;
  if not (me = any(pl.voters)) then raise exception 'lp_not_voter'; end if;
  if p_choice is null or p_choice < 0 or p_choice >= jsonb_array_length(pl.options) then raise exception 'lp_bad_choice'; end if;
  insert into public.lineup_votes(poll_id, voter, voter_player, choice) values (p_poll, auth.uid(), me, p_choice)
  on conflict (poll_id, voter) do update set choice = excluded.choice, created_at = now();
  select count(*) into n from public.lineup_votes where poll_id = p_poll and choice = p_choice;
  if n * 2 > coalesce(array_length(pl.voters, 1), 0) then
    update public.lineup_polls set status = 'closed', winner = p_choice, closed_at = now() where id = p_poll;
    return json_build_object('closed', true, 'winner', p_choice);
  end if;
  return json_build_object('closed', false);
end $$;
-- сколько голосов за каждый вариант (видно всем) и кто уже проголосовал (без того, за что)
create or replace function public.lineup_counts(p_poll bigint) returns table(choice int, votes int)
language sql stable security definer set search_path = public as $$
  select v.choice, count(*)::int from public.lineup_votes v where v.poll_id = p_poll group by v.choice order by 1
$$;
create or replace function public.lineup_voted(p_poll bigint) returns setof text
language sql stable security definer set search_path = public as $$
  select v.voter_player from public.lineup_votes v where v.poll_id = p_poll order by v.created_at
$$;
grant select on public.lineup_polls to anon, authenticated;
grant insert, update, delete on public.lineup_polls to authenticated;
grant select on public.lineup_votes to authenticated;
revoke execute on function public.cast_lineup_vote(bigint, int) from public, anon;
grant execute on function public.cast_lineup_vote(bigint, int) to authenticated;
grant execute on function public.lineup_counts(bigint), public.lineup_voted(bigint) to anon, authenticated;

-- ---------- 6h. Открытое голосование (22.11.2026): все видят, кто за кого проголосовал ----------
create or replace function public.mvp_ballots(p_game text) returns table(voter_player text, candidate text)
language sql stable security definer set search_path = public as $$
  select v.voter_player, v.candidate from public.mvp_votes v where v.game_id = p_game order by v.created_at
$$;
create or replace function public.lineup_ballots(p_poll bigint) returns table(voter_player text, choice int)
language sql stable security definer set search_path = public as $$
  select v.voter_player, v.choice from public.lineup_votes v where v.poll_id = p_poll order by v.created_at
$$;
grant execute on function public.mvp_ballots(text), public.lineup_ballots(bigint) to anon, authenticated;

-- ---------- 6i. Условия деления на команды (23.11.2026) ----------
-- Админ задаёт условия для балансировщика на странице «Составы» (teamrules.js):
--   pitch    — эти игроки питчеры: если пришли, подают они (двое и больше — в разных командах);
--   apart    — двое игроков в разных командах;  together — двое в одной команде;
--   rookies  — новичков поровну (players пустой).
-- Условие применяется, только если нужные игроки отмечены как пришедшие.
create table if not exists public.team_rules (
  id         bigint generated always as identity primary key,
  kind       text not null check (kind in ('pitch','apart','together','rookies')),
  players    text[] not null default '{}',
  active     boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.team_rules enable row level security;
drop policy if exists team_rules_read on public.team_rules;
create policy team_rules_read on public.team_rules for select using (true);
drop policy if exists team_rules_admin on public.team_rules;
create policy team_rules_admin on public.team_rules for all using (public.is_admin()) with check (public.is_admin());
grant select on public.team_rules to anon, authenticated;
grant insert, update, delete on public.team_rules to authenticated;
grant usage, select on all sequences in schema public to authenticated;

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

revoke execute on function public.admin_users(), public.admin_reset_password(uuid, text), public.admin_set_email(uuid, text), public.touch_seen() from public, anon;
grant execute on function public.my_role(), public.is_admin() to anon, authenticated;
grant execute on function public.admin_users(), public.admin_reset_password(uuid, text), public.admin_set_email(uuid, text), public.touch_seen() to authenticated;

-- =====================================================================
-- ПОСЛЕ ТОГО, КАК ВЫ ЗАРЕГИСТРИРУЕТЕСЬ НА САЙТЕ — сделать себя админом
-- (вписать свою почту и запустить только эту строку):
--
-- update public.profiles set role = 'admin', player_id = 'farhad-eyvazov'
--   where id = (select id from auth.users where email = 'ВАША_ПОЧТА');
-- =====================================================================
