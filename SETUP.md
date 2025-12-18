# Sistema de Gestión de Ingresos y Egresos

Sistema fullstack para la gestión de ingresos, egresos y usuarios con control de acceso basado en roles (RBAC).

## 🚀 Tecnologías Utilizadas

- **Frontend:**
  - Next.js 15 (Pages Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn UI
  - Recharts (gráficos)
  - Better Auth (autenticación)

- **Backend:**
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL (Supabase)
  - Better Auth con GitHub OAuth

- **Testing:**
  - Jest
  - React Testing Library

- **Documentación:**
  - OpenAPI/Swagger

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta de GitHub (para OAuth)
- Base de datos PostgreSQL (recomendado: Supabase)

## 🔧 Instalación y Configuración Local

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd prueba-tecnica-fullstack
```

### 2. Instalar dependencias

```bash
npm install --legacy-peer-deps
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```bash
cp .env.example .env
```

Configura las siguientes variables:

#### Base de datos (Supabase)

1. Ve a [Supabase](https://supabase.com/) y crea un nuevo proyecto
2. En Settings > Database, copia la Connection String (URI mode)
3. Pégala en `DATABASE_URL`

```env
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
```

#### GitHub OAuth

1. Ve a [GitHub Developer Settings](https://github.com/settings/developers)
2. Crea una nueva OAuth App:
   - **Application name:** Tu Aplicación
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
3. Copia el Client ID y genera un Client Secret
4. Pégalos en tu `.env`:

```env
GITHUB_CLIENT_ID="tu_client_id_aqui"
GITHUB_CLIENT_SECRET="tu_client_secret_aqui"
```

#### Better Auth Secret

Genera una clave secreta:

```bash
openssl rand -base64 32
```

O usa cualquier string aleatorio seguro:

```env
BETTER_AUTH_SECRET="tu-secret-key-muy-seguro"
```

#### URLs de la aplicación

```env
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Configurar la base de datos

Ejecuta las migraciones de Prisma:

```bash
npx prisma generate
npx prisma db push
```

Si prefieres usar migraciones:

```bash
npx prisma migrate dev --name init
```

### 5. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🧪 Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

## 📚 Documentación de la API

La documentación completa de la API está disponible en:

```
http://localhost:3000/api-docs
```

O consulta el endpoint JSON:

```
http://localhost:3000/api/docs
```

## 🌐 Despliegue en Vercel

### 1. Preparar el proyecto

Asegúrate de que todo esté funcionando localmente.

### 2. Crear proyecto en Vercel

1. Ve a [Vercel](https://vercel.com/)
2. Importa tu repositorio de GitHub
3. Configura el proyecto:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** .next

### 3. Configurar variables de entorno

En Vercel Dashboard > Settings > Environment Variables, agrega:

```
DATABASE_URL=tu_url_de_supabase
BETTER_AUTH_SECRET=tu_secret_generado
GITHUB_CLIENT_ID=tu_github_client_id
GITHUB_CLIENT_SECRET=tu_github_client_secret
NEXT_PUBLIC_BETTER_AUTH_URL=https://tu-app.vercel.app
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
```

### 4. Actualizar GitHub OAuth

1. Ve a tu GitHub OAuth App
2. Actualiza las URLs:
   - **Homepage URL:** `https://tu-app.vercel.app`
   - **Authorization callback URL:** `https://tu-app.vercel.app/api/auth/callback/github`

### 5. Ejecutar migraciones en producción

Desde tu terminal local:

```bash
# Asegúrate de tener DATABASE_URL apuntando a tu base de datos de producción
npx prisma db push
```

### 6. Deploy

Vercel desplegará automáticamente cuando hagas push a tu rama principal.

## 🎯 Funcionalidades

### Roles de Usuario

- **ADMIN:** Acceso completo a todas las funcionalidades
- **USER:** Solo acceso a visualización de movimientos

**Nota:** Todos los nuevos usuarios se crean automáticamente como ADMIN para facilitar las pruebas.

### Módulos

#### 1. Autenticación

- Login con GitHub OAuth
- Manejo de sesiones con Better Auth
- Control de acceso basado en roles (RBAC)

#### 2. Dashboard

- Vista principal con acceso rápido a módulos
- Información del usuario autenticado
- Navegación basada en roles

#### 3. Gestión de Movimientos

- Visualización de todos los ingresos y egresos
- Creación de nuevos movimientos (solo admins)
- Tabla con información detallada de cada transacción

#### 4. Gestión de Usuarios (Solo Admins)

- Lista completa de usuarios
- Edición de información de usuarios
- Asignación de roles

#### 5. Reportes (Solo Admins)

- Visualización de saldo actual
- Gráficos de barras y líneas con datos mensuales
- Descarga de reportes en formato CSV

## 📁 Estructura del Proyecto

```
prueba-tecnica-fullstack/
├── __tests__/              # Pruebas unitarias
├── components/             # Componentes React
│   ├── ui/                 # Componentes Shadcn UI
│   └── Layout.tsx          # Layout principal
├── lib/                    # Utilidades y helpers
│   ├── auth/               # Configuración de autenticación
│   ├── api-helpers.ts      # Helpers para API
│   ├── swagger.ts          # Documentación OpenAPI
│   └── utils.ts            # Utilidades generales
├── pages/                  # Páginas Next.js
│   ├── api/                # API Routes
│   │   ├── auth/           # Endpoints de autenticación
│   │   ├── users/          # Endpoints de usuarios
│   │   ├── reports/        # Endpoints de reportes
│   │   ├── transactions.ts # Endpoints de transacciones
│   │   └── docs.ts         # Documentación de API
│   ├── dashboard.tsx       # Página principal
│   ├── transactions.tsx    # Gestión de movimientos
│   ├── users.tsx           # Gestión de usuarios
│   ├── reports.tsx         # Reportes
│   └── api-docs.tsx        # Página de documentación
├── prisma/                 # Configuración de Prisma
│   └── schema.prisma       # Schema de la base de datos
├── public/                 # Archivos estáticos
├── styles/                 # Estilos globales
├── .env.example            # Ejemplo de variables de entorno
├── jest.config.js          # Configuración de Jest
├── next.config.mjs         # Configuración de Next.js
├── tailwind.config.ts      # Configuración de Tailwind
└── tsconfig.json           # Configuración de TypeScript
```

## 🔒 Seguridad

- **Autenticación:** Todas las rutas protegidas requieren autenticación
- **RBAC:** Control de acceso basado en roles
- **Validación:** Validación de datos en frontend y backend
- **Variables de entorno:** Credenciales sensibles en variables de entorno

## 📝 API Endpoints

### Autenticación

- `POST /api/auth/signin` - Iniciar sesión
- `POST /api/auth/signout` - Cerrar sesión
- `GET /api/auth/session` - Obtener sesión actual

### Transacciones

- `GET /api/transactions` - Listar transacciones
- `POST /api/transactions` - Crear transacción (Admin)

### Usuarios

- `GET /api/users` - Listar usuarios (Admin)
- `PUT /api/users/[id]` - Actualizar usuario (Admin)

### Reportes

- `GET /api/reports` - Obtener datos de reportes (Admin)
- `GET /api/reports/csv` - Descargar CSV (Admin)

### Documentación

- `GET /api/docs` - Especificación OpenAPI

## 🤝 Contribución

Este es un proyecto de prueba técnica. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte de una prueba técnica y es de código abierto.

## 👤 Autor

Desarrollado para Prevalentware

## 📞 Soporte

Para preguntas o soporte, contacta a:

- mlopera@prevalentware.com
- jdsanchez@prevalentware.com
- dfsorza@prevalentware.com
