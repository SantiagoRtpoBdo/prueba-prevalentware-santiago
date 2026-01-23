# Sistema de Gestión Financiera

Aplicación web fullstack para gestionar ingresos y egresos con autenticación, control de roles y reportes financieros, construida con Next.js, TypeScript y PostgreSQL.

### Requisitos previos

- Node.js 18+
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio:**

```bash
git clone <tu-repositorio>
cd Sistema_de_Gestion_Financiera
```

2. **Instalar dependencias:**

```bash
npm install
npm install --legacy-peer-deps

> **Nota:** Se usa `--legacy-peer-deps` debido a conflictos de versiones entre Better Auth y Prisma.
```

3. **Configurar variables de entorno:**

Crear archivo `.env` en la raíz del proyecto con:

```
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
BETTER_AUTH_SECRET=...
NEXT_PUBLIC_BETTER_AUTH_URL=...
NEXT_PUBLIC_APP_URL=...
BREVO_API_KEY=...
EMAIL_FROM=...
```

### 4. Configurar la Base de Datos

4. **Configurar la Base de Datos:**
```bash
# Generar cliente Prisma
npx prisma generate

# Crear tablas en Supabase
npx prisma db push

# (Opcional) Abrir Prisma Studio para ver datos
npx prisma studio

# Migracion de la base de datos
npx prisma migrate dev
``

5. **Iniciar el servidor de desarrollo:**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Acceso a Documentación de API

La documentación de API (Swagger/OpenAPI) está disponible en:

```
http://localhost:3000/api-docs
```

## Pruebas

Ejecutar pruebas unitarias:

```bash
npm test
```

Con cobertura:

```bash
npm run test:coverage
```

## Estructura del Proyecto

- **pages/** - Rutas y páginas de la aplicación
- **components/** - Componentes React (atoms, molecules, organisms)
- **lib/** - Utilidades, configuración de autenticación y API
- **hooks/** - Hooks personalizados
- **prisma/** - Schema de base de datos
- **styles/** - Estilos globales
- ****tests**/** - Pruebas unitarias

