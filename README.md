# 🚀 Sistema de Gestión Financiera - Prevalentware

Un sistema completo para la gestión de movimientos financieros (ingresos y egresos) con autenticación robusta, sistema de roles y reportes avanzados, construido con Next.js Pages Router.

## 📋 Descripción del Proyecto

**Sistema de Gestión Financiera** es una aplicación web fullstack desarrollada con **Next.js** que permite gestionar movimientos financieros con autenticación segura mediante GitHub OAuth y email/password, control de acceso basado en roles (RBAC) y generación de reportes con visualización gráfica.

## Prueba Técnica para Desarrollador Fullstack

### Introducción

El objetivo de esta prueba técnica es evaluar tus habilidades en el desarrollo de una aplicación fullstack. Deberás implementar un sistema de gestión de ingresos y egresos, la gestión de usuarios y la generación de reportes. El proyecto cuenta con [wireframes](<https://www.figma.com/design/2PINjveveJJ9ZAAwxwNoRK/Wireframes-(Copy)?node-id=0-1&t=6q0Q0id8YnjH9fJt-1>) que pueden servir de guía para el candidato. Sin embargo, el diseño de la interfaz de usuario es libre.

### Requisitos del Proyecto

#### Funcionalidades Principales

1. **Roles y Permisos**
   - **Roles:**
     - **Usuario:** Solo puede acceder a la gestión de movimientos.
     - **Administrador:** Puede ver los reportes, editar usuarios y agregar movimientos.
   - **Nota:** Para efectos de prueba, todos los nuevos usuarios deben ser automáticamente asignados con el rol "ADMIN".

2. **Home**
   - Página de inicio con un menú principal que permite la navegación a tres secciones:
     - Sistema de gestión de ingresos y gastos (disponible para todos los roles)
     - Gestión de usuarios (solo para administradores)
     - Reportes (solo para administradores)

3. **Sistema de Gestión de Ingresos y Gastos**
   - **Vista de Ingresos y Egresos**
     - Implementar una tabla que muestre los ingresos y egresos registrados con las siguientes columnas:
       - Concepto
       - Monto
       - Fecha
       - Usuario
     - Botón "Nuevo" para agregar un nuevo ingreso o egreso (solo para administradores).
   - **Formulario de Nuevo Ingreso/Egreso**
     - Formulario con los campos:
       - Monto
       - Concepto
       - Fecha
     - Botón para guardar el nuevo movimiento.

4. **Gestión de Usuarios** (solo para administradores)
   - **Vista de Usuarios**
     - Tabla que muestre la lista de usuarios con las siguientes columnas:
       - Nombre
       - Correo
       - Teléfono
       - Acciones (editar usuario)
   - **Formulario de Edición de Usuario**
     - Formulario con los campos:
       - Nombre
       - Rol
     - Botón para guardar los cambios.

5. **Reportes** (solo para administradores)
   - Mostrar un gráfico de movimientos financieros.
   - Mostrar el saldo actual.
   - Botón para descargar el reporte en formato CSV.

### Requisitos Técnicos

- **Tecnologías y Herramientas:**
  - **Frontend:**
    - Next.js utilizando `pages` router.
    - TypeScript.
    - Tailwind CSS.
    - Shadcn para componentes de la interfaz de usuario.
    - NextJS API routes para comunicación con el backend.
  - **Backend:**
    - NextJS API routes para implementar endpoints REST.
    - Base de datos de Postgres en Supabase.
     - **Documentación de API:** Implementar una ruta `/api/docs` que exponga la documentación del API usando OpenAPI/Swagger. Cada endpoint creado debe estar completamente documentado con sus parámetros, respuestas y ejemplos.
   - **Protección de Datos:**
     - Implementar control de acceso basado en roles (RBAC) para asegurar que solo los usuarios autorizados puedan acceder a ciertas funcionalidades y datos.
     - Proteger el backend para que rechace conexiones no autenticadas.
   - **Autenticación:**
     - Utilizar [Better Auth](https://www.better-auth.com/) con [GitHub](https://github.com/settings/developers) como proveedor de autenticación y [Prisma](https://prisma.io) como adaptador para la autenticación por sesiones de base de datos.
     - **IMPORTANTE:** Todos los nuevos usuarios que se registren deben ser automáticamente asignados con el rol "ADMIN" para facilitar las pruebas de la aplicación.
   - **Pruebas unitarias**  - El candidato debe agregar al menos 3 pruebas unitarias donde considere necesario.
  - **Despliegue:**
    - Desplegar el proyecto en Vercel.

### Entregables

1. **Código Fuente:**
   - Repositorio en GitHub con el código fuente del proyecto.
   - Incluir un archivo README con instrucciones claras sobre cómo ejecutar el proyecto localmente y cómo desplegarlo en Vercel.

2. **Despliegue:**
   - Proyecto desplegado en Vercel con la URL proporcionada.

### Criterios de Evaluación

- **Funcionalidad:**
  - Cumplimiento de todos los requisitos funcionales.
  - Correcta implementación del CRUD para ingresos, egresos y usuarios.
  - Generación y descarga de reportes en formato CSV.

- **Calidad del Código:**
  - Calidad y claridad del código.
  - Uso adecuado de las mejores prácticas de desarrollo.
  - Estructura del proyecto.
  - Documentación completa de la API con OpenAPI/Swagger.

- **Diseño y UX:**
  - Usabilidad de la interfaz.
  - Implementación de un diseño atractivo.

- **Pruebas y Documentación:**
  - Cobertura de pruebas unitarias.
  - Calidad de los comentarios dentro del proyecto.

- **Seguridad:**
  - Implementación efectiva de control de acceso basado en roles (RBAC).
  - Protección adecuada de los datos sensibles.

- **Notas**:
  - El aplicativo no debe contener diseño responsivo.
  - El candidato puede utilizar el código cargado en este repositorio. Sin embargo, esta no es una condición necesaria y el candidato puede iniciar el proyecto de 0 si lo desea.
  - El candidato puede cambiar las versiones de las librerías si lo considera necesario.
  - El candidato debe compartir el acceso al repositorio de GitHub y el .env a los correos mlopera@prevalentware.com, jdsanchez@prevalentware.com y dfsorza@prevalentware.com

---

## ✨ Características Implementadas

- **🔐 Autenticación dual** con Better Auth (GitHub OAuth + Email/Password)
- **👥 Sistema de roles** (USER/ADMIN) con permisos granularizados
- **💰 Gestión de transacciones** financieras (ingresos/egresos)
- **📊 Reportes avanzados** con gráficos interactivos y exportación a CSV
- **🛡️ Validación robusta** de datos en frontend y backend
- **📚 API REST documentada** con OpenAPI/Swagger
- **✅ 14 pruebas unitarias** con Jest y React Testing Library
- **⚡ Control de acceso RBAC** en todas las rutas

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15** con Pages Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilización moderna
- **Shadcn UI** - Componentes accesibles
- **Recharts** - Gráficos interactivos

### Backend
- **Next.js API Routes** - Endpoints REST
- **Prisma ORM** - Gestión de base de datos
- **PostgreSQL** - Base de datos (Supabase)
- **Better Auth** - Autenticación y sesiones
- **Resend** - Envío de emails (opcional)

### Testing & Tools
- **Jest** - Testing framework
- **React Testing Library** - Tests de componentes
- **OpenAPI/Swagger** - Documentación de API

## 📁 Estructura del Proyecto

```
├── components/           # Componentes React reutilizables
│   ├── Layout.tsx       # Layout principal con navegación
│   └── ui/              # Componentes de Shadcn UI
├── lib/                 # Utilidades y configuraciones
│   ├── auth/            # Configuración de Better Auth
│   │   ├── index.ts     # Servidor de autenticación
│   │   └── client.ts    # Cliente de autenticación
│   ├── api-helpers.ts   # Middleware de autenticación
│   └── swagger.ts       # Especificación OpenAPI
├── pages/               # Páginas y rutas de la aplicación
│   ├── index.tsx        # Login (GitHub + Email)
│   ├── dashboard.tsx    # Dashboard principal
│   ├── transactions.tsx # Gestión de transacciones
│   ├── users.tsx        # Gestión de usuarios (admin)
│   ├── reports.tsx      # Reportes y gráficos (admin)
│   ├── api-docs.tsx     # Documentación Swagger UI
│   └── api/             # Endpoints REST
│       ├── auth/        # Autenticación Better Auth
│       ├── transactions.ts # CRUD de transacciones
│       ├── users/       # Gestión de usuarios
│       ├── reports/     # Reportes y CSV
│       └── docs.ts      # Especificación API
├── prisma/              # Esquema de base de datos
│   └── schema.prisma    # Modelos de Prisma
├── types/               # Tipos TypeScript personalizados
└── __tests__/           # Pruebas unitarias
```

## 🚀 Instalación y Configuración Local

### Prerrequisitos
- **Node.js 18+** (runtime)
- **npm** o **yarn** (package manager)
- **Cuenta de GitHub** (para OAuth)
- **Supabase** (base de datos PostgreSQL)

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd prueba-tecnica-fullstack
```

### 2. Instalar Dependencias

```bash
npm install --legacy-peer-deps
```

> **Nota:** Se usa `--legacy-peer-deps` debido a conflictos de versiones entre Better Auth y Prisma.

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# 🗄️ Base de datos Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"

# 🔐 Better Auth
BETTER_AUTH_SECRET="genera-clave-secreta-segura"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# 🔑 GitHub OAuth
GITHUB_CLIENT_ID="tu-client-id"
GITHUB_CLIENT_SECRET="tu-client-secret"

# 🌐 URLs de la aplicación
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# 📧 Email (Opcional - para autenticación por email)
RESEND_API_KEY="re_tu_api_key"
EMAIL_FROM="noreply@tudominio.com"
```

#### Obtener credenciales de Supabase:

1. Ve a [Supabase](https://supabase.com/) y crea un proyecto
2. En **Settings → Database**, copia la **Connection String (URI mode)**
3. Reemplaza `[PASSWORD]` con tu contraseña

#### Configurar GitHub OAuth:

1. Ve a [GitHub Developer Settings](https://github.com/settings/developers)
2. Crea una **New OAuth App**:
   - **Application name:** Sistema Gestión Financiera
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
3. Copia el **Client ID** y genera un **Client Secret**

#### Generar BETTER_AUTH_SECRET:

```bash
openssl rand -base64 32
```

### 4. Configurar la Base de Datos

```bash
# Generar cliente Prisma
npx prisma generate

# Crear tablas en Supabase
npx prisma db push

# (Opcional) Abrir Prisma Studio para ver datos
npx prisma studio
```

### 5. Ejecutar la Aplicación

```bash
# Modo desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3000
```

## 🎯 Rutas de la Aplicación

### Páginas Públicas
- `/` - Login (GitHub OAuth + Email/Password)

### Páginas Protegidas (Requiere autenticación)
- `/dashboard` - Dashboard principal con navegación
- `/transactions` - Gestión de transacciones (todos los usuarios)

### Páginas de Administrador (Solo ADMIN)
- `/users` - Gestión de usuarios
- `/reports` - Reportes con gráficos y exportación CSV
- `/api-docs` - Documentación Swagger de la API

## 📊 Endpoints de la API

### 💰 Transacciones
- `GET /api/transactions` - Listar transacciones del usuario autenticado
- `POST /api/transactions` - Crear nueva transacción (solo admin)

### 👥 Usuarios
- `GET /api/users` - Listar todos los usuarios (solo admin)
- `PUT /api/users/[id]` - Actualizar usuario (solo admin)

### 📈 Reportes
- `GET /api/reports` - Obtener datos para gráficos (solo admin)
- `GET /api/reports/csv` - Descargar reporte en CSV (solo admin)

### 📚 Documentación
- `GET /api/docs` - Especificación OpenAPI/Swagger JSON
- UI: `/api-docs` - Interfaz Swagger UI

## 🔐 Sistema de Autenticación

### Métodos de Autenticación Soportados

#### 1. GitHub OAuth
- Inicio de sesión rápido con cuenta de GitHub
- Automáticamente crea usuario con rol ADMIN
- Callback URL: `/api/auth/callback/github`

#### 2. Email y Contraseña
- Registro con email, contraseña y nombre
- Verificación de email obligatoria
- Emails enviados con Resend (requiere `RESEND_API_KEY`)

### Flujo de Autenticación

1. Usuario accede a `/` (página de login)
2. Elige método de autenticación (GitHub o Email)
3. Si es exitoso, redirige a `/dashboard`
4. Sesión almacenada en base de datos (Better Auth)

## 👥 Sistema de Roles y Permisos

### Roles Disponibles
- **USER**: Usuarios regulares con acceso limitado
- **ADMIN**: Administradores con acceso completo

### Matriz de Permisos

| Funcionalidad | USER | ADMIN |
|--------------|------|-------|
| Ver transacciones propias | ✅ | ✅ |
| Crear transacciones | ❌ | ✅ |
| Ver todas las transacciones | ❌ | ✅ |
| Gestionar usuarios | ❌ | ✅ |
| Ver reportes | ❌ | ✅ |
| Descargar CSV | ❌ | ✅ |
| Acceder a `/api-docs` | ❌ | ✅ |

> **Nota:** Todos los nuevos usuarios se crean automáticamente como **ADMIN** para facilitar las pruebas.

## 🧪 Pruebas

El proyecto incluye **14 pruebas unitarias** implementadas con Jest y React Testing Library.

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

### Archivos de Pruebas
- `__tests__/lib/api-helpers.test.ts` - Middleware de autenticación
- `__tests__/components/Layout.test.tsx` - Componente de layout
- `__tests__/lib/swagger.test.ts` - Documentación de API

## 🗃️ Modelos de Base de Datos

### User
```prisma
model User {
  id            String        @id
  name          String
  email         String        @unique
  emailVerified Boolean
  role          Role          @default(ADMIN)
  phone         String?
  image         String?
  sessions      Session[]
  accounts      Account[]
  transactions  Transaction[]
}
```

### Transaction
```prisma
model Transaction {
  id        String          @id @default(cuid())
  concept   String
  amount    Float
  type      TransactionType  // INCOME o EXPENSE
  date      DateTime        @default(now())
  userId    String
  user      User            @relation(fields: [userId])
}
```

### Enums
```prisma
enum Role {
  USER
  ADMIN
}

enum TransactionType {
  INCOME
  EXPENSE
}
```

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Servidor desarrollo
npm run build            # Build producción
npm run start            # Servidor producción

# Base de datos
npx prisma generate      # Generar cliente Prisma
npx prisma db push       # Sincronizar esquema con BD
npx prisma studio        # Abrir interfaz visual de BD
npx prisma migrate dev   # Crear migración

# Testing
npm test                 # Ejecutar pruebas
npm run test:watch       # Modo watch
npm run test:coverage    # Cobertura de código

# Linting
npm run lint             # Ejecutar ESLint
```

## 📚 Documentación Adicional

- **SETUP.md** - Guía detallada de instalación y despliegue
- **IMPLEMENTATION.md** - Detalles técnicos de implementación
- **CHECKLIST.md** - Lista de verificación de funcionalidades

## 🔒 Seguridad Implementada

- ✅ Autenticación robusta con Better Auth
- ✅ Sesiones almacenadas en base de datos
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Middleware de autorización en todas las rutas API
- ✅ Validación de roles (RBAC)
- ✅ Protección CSRF incluida por defecto
- ✅ Cookies HTTP-only para sesiones

## 🐛 Troubleshooting

### Error al instalar dependencias
```bash
npm install --legacy-peer-deps
```

### Error de conexión a base de datos
1. Verifica que `DATABASE_URL` en `.env` sea correcta
2. Asegúrate de que el proyecto de Supabase esté activo
3. Ejecuta `npx prisma db push` para crear las tablas

### GitHub OAuth no funciona
1. Verifica que `GITHUB_CLIENT_ID` y `GITHUB_CLIENT_SECRET` estén en `.env`
2. Confirma que la Callback URL en GitHub sea correcta
3. Reinicia el servidor después de cambiar variables de entorno

### No se envían emails de verificación
1. En desarrollo, los links aparecen en la consola del servidor
2. Para producción, configura `RESEND_API_KEY` y `EMAIL_FROM`
3. Instala `resend`: `npm install resend --legacy-peer-deps`

## 📝 Notas Técnicas

- **Next.js Pages Router**: Utiliza el router tradicional de Next.js
- **Supabase**: PostgreSQL con connection pooling
- **Better Auth**: Solución moderna de autenticación para Next.js
- **Prisma**: ORM type-safe para TypeScript
- **Shadcn UI**: Componentes accesibles y personalizables

---

**¿Problemas?** Revisa la documentación en `/api-docs` o abre un issue en el repositorio.
