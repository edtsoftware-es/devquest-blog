# 📝⚔️ Blog DevQuest

Un blog moderno desarrollado con Next.js 15 y Convex, con autenticación, sistema de comentarios y gestión de contenido.

Puedes ver una demo en vivo aquí: [https://devquest-blog.vercel.app](https://devquest-blog.vercel.app)

## 🚀 Características

- ✨ **Next.js 15** con App Router y React 19
- 🔐 **Convex Auth** para autenticación
- 💬 **Sistema de comentarios** en tiempo real
- 🎨 **shadcn/ui** componentes con TailwindCSS
- 📱 **Responsive** y accesible
- 🌙 **Modo oscuro / ☀️ claro** 
- 🔍 **Búsqueda** de posts y categorías
- 📝 **Editor de contenido** con TipTap
- ⚡ **Optimizado** para rendimiento

## 📋 Requisitos previos

- **Node.js** 20.0 o superior
- **pnpm** (recomendado) o npm
- Una cuenta en [Convex](https://convex.dev)

## 🛠️ Instalación

### 1. Fork y clona el repositorio

```bash
git clone https://github.com/TU_USUARIO/devquest-blog.git
cd devquest-blog
```

### 2. Instala las dependencias

```bash
# Usando pnpm (recomendado)
pnpm install

# O usando npm
npm install
```

### 3. Configuración de Convex

#### 3.1. Instala Convex CLI globalmente
```bash
npm install -g convex
```

#### 3.2. Inicia sesión en Convex
```bash
convex login
```

#### 3.3. Conecta el proyecto con tu deployment de Convex
```bash
convex dev
```

Este comando:
- Conectará el proyecto con tu deployment existente de Convex
- Generará automáticamente el archivo `convex/_generated/`
- Configurará el archivo `.env.local` con las variables necesarias
- Sincronizará el esquema y las funciones con tu deployment

### 4. Configuración de variables de entorno

El comando `convex dev` creará automáticamente el archivo `.env.local` con las variables básicas de Convex.

#### 4.1. Variables locales automáticas de Convex (.env.local)
```env
# Convex (generadas automáticamente)
CONVEX_DEPLOYMENT=tu-deployment-url
NEXT_PUBLIC_CONVEX_URL=https://tu-deployment.convex.cloud
SETUP_SCRIPT_RAN=1
```

Si no se generó, crea un archivo `.env.local` en la raíz del proyecto con estas variables.

### 5. Configuración de autenticación

#### 5.1. Ejecuta el script de instalación de dependencias necesarias

```bash
#Uso de pnpm (recomendado)
pnpm add @convex-dev/auth @auth/core@0.37.0

#O usando npm
npm install @convex-dev/auth @auth/core@0.37.0
```

#### 5.2. Ejecuta el script de configuración de auth
```bash
npx @convex-dev/auth
```

```bash
#Para producción
npx @convex-dev/auth prod
```

#### 5.3. Variables de autenticación requeridas (aplicables en el dashboard de Convex)

**Variables obligatorias para el funcionamiento:**
```env
# URL del sitio (requerida para auth)

SITE_URL=http://localhost:3000

# Claves JWT (generadas automáticamente por Convex Auth)

JWT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
JWKS={"keys":[...]}
```

#### 5.3. Configurar Google OAuth
[Documentación oficial](https://labs.convex.dev/auth/config/oauth/google)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google y crea una nueva App web
4. Ve a "Credenciales" → "Crear credenciales" → "ID de cliente de OAuth 2.0"
5. Configura:
   - **Orígenes de JavaScript autorizados**: `http://localhost:3000`
   - **URI de redirección autorizados**: `https://<nombre-de-tu-entorno>.convex.site/api/auth/callback/google`
6. Genera la SECRET-KEY y agrega los valores a tu entorno de desarrollo mediante el dashboard de Convex.

```env
AUTH_GOOGLE_ID=tu-google-client-id
AUTH_GOOGLE_SECRET=tu-google-client-secret
```

#### 5.4. Configurar Discord OAuth

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Crea una nueva aplicación
3. Ve a "OAuth2" → "General"
4. Añade la redirect URI: `https://<nombre-de-tu-entorno>.convex.site/api/auth/callback/discord`
5. Copia el **Client ID** y **Client Secret**
6. Genera la SECRET-KEY y agrega los valores a tu entorno de desarrollo mediante el dashboard de Convex.

```env
DISCORD_AUTH_CLIENT_ID=tu-discord-client-id
DISCORD_AUTH_CLIENT_SECRET=tu-discord-client-secret
```

### 6. Generar datos de prueba con faker

Una vez que Convex esté configurado, puedes generar datos de prueba para el blog:

```bash
# Ejecuta el proyecto (esto iniciará tanto Next.js como Convex)
pnpm dev
```

Este comando iniciará automáticamente:
- **Next.js** en [http://localhost:3000](http://localhost:3000)
- **Convex backend**
- **Convex Dashboard cloud** (entorno desarrollo)

```bash
# En otra terminal, ejecuta el seed
npx convex run init
```

Este comando generará:
- Categorías de ejemplo
- Posts de prueba con contenido
- Usuarios de ejemplo
- Comentarios de prueba
- Datos necesarios para el funcionamiento del blog

### 7. Accede al blog

✨Accede a tu blog en [http://localhost:3000](http://localhost:3000)✨

### 8. Usuario administrador y dashboard

Para acceder al dashboard de administración, inicia sesión con un usuario que tenga permisos de administrador.

También puedes modificar el rol de tu usuario directamente en la base de datos de Convex para otorgarte permisos de administrador.

Desde el dashboard, podrás gestionar el contenido del blog, revisar posts pendientes de aprobación, y crear los tuyos propios.

## 🔧 Configuración adicional

### Personalización de dominio (Para producción)

1. En tu dashboard de Convex, ve a **Settings** → **Domains**
2. Configura tu dominio personalizado
3. Actualiza `SITE_URL` en producción con tu dominio real
4. Actualiza las **Authorization callback URLs** en todos los providers OAuth:
   - Google: `https://tu-dominio.com/api/auth/callback/google`
   - Discord: `https://tu-dominio.com/api/auth/callback/discord`


## 📚 Estructura del proyecto

```
├── app/                    # Next.js 15 App Router
│   ├── (private)/         # Rutas privadas (dashboard)
│   ├── (public)/          # Rutas públicas
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── ui/               # shadcn/ui components
│   ├── cards/            # Componentes de tarjetas
│   ├── comments/         # Sistema de comentarios
│   └── layout/           # Layout components
├── convex/               # Backend Convex
│   ├── *.ts             # Funciones de Convex
│   ├── schema.ts        # Esquema de base de datos
│   └── auth.config.ts   # Configuración de auth
├── hooks/               # React hooks personalizados
├── lib/                 # Utilidades
```


## 🐛 Solución de problemas comunes

### Error: "ConvexError: Configuration is missing"
```bash
# Asegúrate de ejecutar el proyecto completo
pnpm dev
```

### Error: "No data available" o blog vacío
```bash
# Genera datos de prueba
npx convex run init
```

### Error: "Authentication failed"
1. Verifica que las variables de OAuth estén correctas
2. Confirma que la callback URL coincida exactamente 
3. Reinicia el servidor de desarrollo

## Documentación oficial relacionada
- [Next.js 15](https://nextjs.org/docs)
- [Convex](https://docs.convex.dev)
- [Convex Auth](https://labs.convex.dev/auth)
- [shadcn/ui](https://ui.shadcn.com)
- [TipTap Editor](https://tiptap.dev/)
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)

## 📄 License

Este proyecto está licenciado bajo la MIT License - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas durante la instalación:

Revisa la [documentación de Convex](https://docs.convex.dev)
