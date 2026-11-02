-- À coller dans Supabase > SQL Editor > Run
create table orders(ref text primary key,name text not null,phone text not null,email text,ticket_type int not null,qty int not null,total int not null,status text not null default 'pending',operator text,txid text,created_at timestamptz default now());
create table tickets(code text primary key,order_ref text references orders(ref),name text,type text,max_scans int default 1,scans int default 0,last_scan timestamptz,status text not null default 'pending');
alter table orders enable row level security;
alter table tickets enable row level security;
-- Aucune règle publique : seules les fonctions du site (clé service) lisent et écrivent.
