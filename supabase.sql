-- Tables
create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text not null,
  created_at timestamptz default now()
);

create table if not exists responses (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references participants(id) on delete cascade,
  q1 text not null,
  q2 text not null,
  q3 text not null,
  q4 text not null,
  q5 text not null,
  intent text,
  score int not null,
  is_correct boolean not null,
  created_at timestamptz default now()
);

create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references participants(id) on delete cascade,
  code varchar(12) not null unique,
  status text not null default 'issued', -- issued | redeemed | expired
  redeemed_by text,
  redeemed_at timestamptz,
  created_at timestamptz default now()
);

-- Export function
create or replace function export_joined_csv() returns text language sql as $$
  with rows as (
    select p.name, p.email, p.phone, r.score, r.is_correct, r.intent, c.code, c.status, r.created_at
    from participants p
    left join responses r on r.participant_id = p.id
    left join coupons c on c.participant_id = p.id
    order by r.created_at desc
  )
  select string_agg(
    format('%s,%s,%s,%s,%s,%s,%s,%s,%s',
      name, email, phone, score, is_correct, intent, code, status, to_char(created_at,'YYYY-MM-DD\"T\"HH24:MI:SS')
    ), E'\n')
  from rows;
$$;
