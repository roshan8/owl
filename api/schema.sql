
create or replace function percentage(v numeric, t numeric)
returns numeric as $$
    begin return case when t = 0 then 0 else v / t * 100.0 end; end;
$$ language plpgsql;

create or replace function timestamptz_in_of(t timestamptz, i text, r timestamptz)
returns boolean as $$
    begin return t::timestamptz between r::timestamptz and r::timestamptz + i::interval; end;
$$ language plpgsql;

create type website_status as enum ('unknown', 'up', 'maintenance', 'down');

create table websites (
    id serial primary key,
    updated_at timestamptz not null default current_timestamp,
    status website_status not null default 'unknown',
    url text not null
);

create table checks (
    id serial primary key,
    checked_at timestamptz not null default current_timestamp,
    website_id integer references websites (id),
    status_code numeric not null,
    duration numeric not null,
    breakdown jsonb not null default '{}'
);
