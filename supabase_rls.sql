-- 0. Función de ayuda (Security Definer) para evitar recursión infinita
-- Esta función se ejecuta con privilegios de sistema, saltando el RLS sólo para esta consulta.
create or replace function get_my_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role from profiles where id = auth.uid();
$$;

-- 1. Habilitar RLS
alter table profiles enable row level security;
alter table incidents enable row level security;
alter table contacts enable row level security;

-- Limpiar políticas previas por si acaso
drop policy if exists "Users can view their own profile" on profiles;
drop policy if exists "Admins can view all profiles" on profiles;
drop policy if exists "Locals can see their own incidents" on incidents;
drop policy if exists "Staff can see all incidents" on incidents;
drop policy if exists "Anyone authenticated can create incidents" on incidents;
drop policy if exists "Staff can update incidents" on incidents;
drop policy if exists "Anyone authenticated can view contacts" on contacts;
drop policy if exists "Staff can manage contacts" on contacts;

-- 2. Políticas para PROFILES
-- Permitir a todos ver su propio perfil
create policy "Profiles self view"
on profiles for select
using ( auth.uid() = id );

-- Permitir a admins ver todos los perfiles (usando la función para evitar loop)
create policy "Profiles admin view"
on profiles for select
using ( get_my_role() = 'admin' );

-- 3. Políticas para INCIDENTS
-- Los locales ven las suyas
create policy "Incidents local view"
on incidents for select
using ( created_by = auth.uid() );

-- Staff ve todas (usando la función)
create policy "Incidents staff view"
on incidents for select
using ( get_my_role() in ('admin', 'controller') );

-- Permiso para insertar
create policy "Incidents insert"
on incidents for insert
with check ( auth.role() = 'authenticated' );

-- Permiso para actualizar (Staff)
create policy "Incidents staff update"
on incidents for update
using ( get_my_role() in ('admin', 'controller') );

-- 4. Políticas para CONTACTS
create policy "Contacts view"
on contacts for select
using ( auth.role() = 'authenticated' );

create policy "Contacts staff manage"
on contacts for all
using ( get_my_role() in ('admin', 'controller') );
