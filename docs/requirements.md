# Documento de Requisitos: App de Gestión de Mantenimiento para Centro Comercial

## 1. Introducción
El sistema consiste en una Aplicación Web Progresiva (PWA) diseñada para facilitar y organizar las labores de mantenimiento e incidencias de un pequeño centro comercial (aprox. 10 locales), gestionado por una gestoría.

## 2. Actores y Roles
### 2.1 Administrador / Gestor
- **Permisos:** Acceso total al sistema.
- **Responsabilidades:** Gestión de usuarios (altas/bajas), supervisión global, configuración de parámetros del sistema.

### 2.2 Controlador / Encargado de Mantenimiento
- **Permisos:** Gestión de incidencias y agenda.
- **Responsabilidades:** 
  - Revisar incidencias reportadas (admitir/descartar).
  - Asignar técnicos/especialistas.
  - Gestionar la agenda de contactos.
  - Seguimiento del estado de las reparaciones.

### 2.3 Local Comercial (Usuario Final)
- **Permisos:** Reporte y visualización de sus propias incidencias.
- **Responsabilidades:** Informar de nuevas incidencias, aportar detalles y evidencias (fotos/pdf).

## 3. Módulos y Funcionalidades Principales

### 3.1 Gestión de Incidencias
- **Creación:** Formulario accesible para el rol "Local Comercial".
    - Campos: Fecha, Tipo (Electricidad, Fontanería, etc.), Descripción, Adjuntos, Prioridad.
- **Gestión:** Flujo de estados gestionado por el "Controlador".
    - Estados propuestos: Reportada, Revisión, Admitida (Asignada), En Espera (Material), En Progreso, Finalizada, Descartada.
- **Historial/Comentarios:** Sistema de bitácora para añadir actuaciones (ej: "Día 1: Visita inicial", "Día 2: Reparación").

### 3.2 Agenda de Contactos
- Base de datos de especialistas (fontaneros, electricistas, etc.).
- Accesible para el Controlador para realizar llamadas rápidas o asignaciones.

### 3.3 Notificaciones
- Integración (o simulación/enlace) para enviar reportes o avisos vía Email y WhatsApp.

## 4. Datos del Sistema (Entidades)

### Incidencia
- ID
- Fecha de Reporte
- Solicitante (Local)
- Tipo (Categoría)
- Descripción
- Archivos Adjuntos (Fotos/PDF)
- Prioridad (Alta, Media, Baja)
- Plazo de Ejecución (Inicio/Fin estimados)
- Estado Actual
- Historial de Actuaciones (Comentarios con fecha)
- Técnico Asignado (opcional)

### Usuario / Local
- Nombre
- Rol
- Datos de contacto

### Proveedor / Técnico
- Nombre
- Especialidad
- Teléfono / Email

## 5. Requerimientos No Funcionales
- **Plataforma:** PWA (Progressive Web App), instalable en Android y accesible vía navegador web.
- **Diseño:** Interfaz moderna, "premium", fácil de usar (UX cuidado).
- **Conectividad:** Capacidad de funcionamiento offline básico (consultas caché) y sincronización al recuperar conexión (deseable).
