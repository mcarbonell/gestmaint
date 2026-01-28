# ASVIAN - Sistema de Gestión de Mantenimiento

[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

> **Sistema integral de gestión de incidencias y mantenimiento para el Parque Comercial Albán**

ASVIAN (también conocido como GestMaint) es una Progressive Web App (PWA) diseñada para centralizar y agilizar la comunicación entre locales comerciales, la gestoría y el equipo de mantenimiento de un centro comercial.

---

## ✨ Características Principales

### 🏢 Para Locales Comerciales
- **Reportar incidencias en 3 clics** - Interfaz simplificada con formulario intuitivo
- **Subida de fotos y documentos** - Evidencias visuales adjuntas a cada reporte
- **Seguimiento en tiempo real** - Visibilidad del estado de sus incidencias
- **Historial completo** - Acceso al historial de todas sus incidencias reportadas

### 🛠️ Para el Controlador de Mantenimiento
- **Tablero Kanban** - Vista organizada de incidencias por estado (Pendientes, En Progreso, Finalizadas)
- **Agenda de especialistas** - Directorio de técnicos por especialidad con llamada directa
- **Gestión de estados** - Flujo completo: Reportada → Admitida → En Progreso → Finalizada
- **Bitácora de actuaciones** - Historial detallado con comentarios y cambios de estado
- **Compartir por WhatsApp** - Envío rápido de información a técnicos externos

### 📊 Para la Administración/Gestoría
- **Gestión de usuarios** - Alta, baja y modificación de roles (Admin, Controller, Local)
- **Visión global** - Dashboard con estadísticas de incidencias
- **Control de accesos** - Sistema de autenticación seguro con Supabase Auth

---

## 🚀 Tecnologías

| Capa | Tecnología |
|------|------------|
| **Frontend** | React 19 + Vite |
| **Routing** | React Router 7 |
| **Estilos** | Vanilla CSS + CSS Modules |
| **Backend** | Supabase (PostgreSQL, Auth, Storage) |
| **PWA** | vite-plugin-pwa + Workbox |
| **Notificaciones** | Supabase Edge Functions + Resend API |
| **Iconos** | Lucide React |

---

## 📁 Estructura del Proyecto

```
asvian/
├── src/
│   ├── components/
│   │   ├── layout/Layout.jsx          # Layout responsive con sidebar
│   │   └── incidents/IncidentForm.jsx # Formulario de incidencias
│   ├── context/
│   │   ├── AuthContext.jsx            # Autenticación y perfiles
│   │   └── DataContext.jsx            # Gestión de incidencias y contactos
│   ├── pages/
│   │   ├── Dashboard/                 # Dashboard por rol
│   │   ├── Incidents/                 # Listado, detalle y kanban
│   │   ├── Contacts/                  # Agenda de técnicos
│   │   ├── Admin/UserManagement.jsx   # Gestión de usuarios
│   │   ├── Settings/                  # Configuración de perfil
│   │   └── Login/                     # Página de login
│   ├── lib/supabaseClient.js          # Cliente de Supabase
│   └── styles/design-system.css       # Sistema de diseño
├── supabase/
│   └── functions/notify-incident/     # Edge Function para notificaciones
├── docs/                              # Documentación del proyecto
└── public/                            # Assets PWA (iconos, manifest)
```

---

## 🛠️ Instalación y Desarrollo

### Requisitos Previos
- Node.js 18+
- Cuenta en Supabase
- Variables de entorno configuradas

### 1. Clonar y Instalar

```bash
git clone <repo-url>
cd asvian
npm install
```

### 2. Configurar Variables de Entorno

Copiar `.env.example` a `.env` y añadir credenciales de Supabase:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. Esquema de Base de Datos (Supabase)

Crear las siguientes tablas en Supabase:

**Tabla `profiles`**
```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  role text not null check (role in ('admin', 'controller', 'local')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

**Tabla `incidents`**
```sql
create table incidents (
  id uuid default gen_random_uuid() primary key,
  created_by uuid references profiles(id),
  type text not null,
  priority text not null check (priority in ('baja', 'media', 'alta')),
  description text not null,
  status text not null default 'reported',
  files jsonb default '[]',
  history jsonb default '[]',
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

**Tabla `contacts`**
```sql
create table contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  specialty text not null,
  phone text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### 4. Iniciar Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 📱 Uso como PWA

### Instalación
1. Abrir la app en Chrome/Edge/Safari
2. Click en el icono de instalación (➕) en la barra de direcciones
3. O desde el menú → "Instalar ASVIAN"

### Características PWA
- ✅ Funciona offline (consultas cacheadas)
- ✅ Instalable en Android/iOS/Desktop
- ✅ Icono en pantalla de inicio
- ✅ Tema adaptativo

---

## 🎭 Roles de Usuario

| Rol | Permisos | Descripción |
|-----|----------|-------------|
| **admin** | Acceso total | Gestoría del centro comercial |
| **controller** | Incidencias + Agenda | Encargado de mantenimiento |
| **local** | Solo sus incidencias | Locales comerciales |

### Usuarios de Demo

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@asvian.com | gestmaint2026 |
| Controller | mantenimiento@asvian.com | gestmaint2026 |
| Local | zara@asvian.com | gestmaint2026 |

---

## 🐛 Solución de Problemas Conocidos

### Pantalla blanca / Loop de login en Chrome
Ver [docs/PWA_AUTH_BUG_POSTMORTEM.md](docs/PWA_AUTH_BUG_POSTMORTEM.md) para detalles completos.

**Resumen**: Race condition entre `getSession()` y `onAuthStateChange` de Supabase, agravada por el Service Worker en desarrollo.

**Solución aplicada**:
- Flag de inicialización para evitar múltiples cargas de perfil
- Carga de perfil síncrona en `login()`
- SW desactivado en desarrollo
- Exclusión de Supabase del caché del SW

---

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno en el dashboard
3. Deploy automático en cada push

```bash
npm run build
```

### Configuración necesaria

**`vercel.json`** (ya incluido):
```json
{
  "routes": [
    { "src": "/[^.]*", "dest": "/index.html" }
  ]
}
```

---

## 📚 Documentación Adicional

- [docs/client_proposal.md](docs/client_proposal.md) - Propuesta original al cliente
- [docs/requirements.md](docs/requirements.md) - Requisitos funcionales
- [docs/implementation_plan.md](docs/implementation_plan.md) - Plan de implementación
- [docs/PWA_AUTH_BUG_POSTMORTEM.md](docs/PWA_AUTH_BUG_POSTMORTEM.md) - Post-mortem del bug crítico

---

## 🔒 Seguridad

- ✅ Row Level Security (RLS) activado en todas las tablas
- ✅ Variables de entorno protegidas
- ✅ Tokens gestionados automáticamente por Supabase
- ✅ `.gitignore` excluye archivos sensibles

---

## 📝 Licencia

Proyecto privado desarrollado para el Parque Comercial Albán.

---

<p align="center">
  <strong>ASVIAN</strong> - Gestión técnica simplificada
</p>
