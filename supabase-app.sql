-- À coller dans Supabase > SQL Editor > Run (après supabase.sql)
create table teams(id serial primary key,name text not null,city text,palmares text,created_at timestamptz default now());
create table matches(id serial primary key,team_a int references teams(id),team_b int references teams(id),field text,status text not null default 'scheduled',score_a int not null default 0,score_b int not null default 0,events jsonb not null default '[]',started_at timestamptz,base_sec int not null default 0,created_at timestamptz default now());
alter table teams enable row level security;
alter table matches enable row level security;
