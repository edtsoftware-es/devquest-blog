# Esquema de Base de Datos - Blog App

## Tablas

### `users`

- `id` (string, autogenerado)
- `externalId` (string) – ID de Discord
- `name` (string)
- `email` (string, opcional)
- `avatarUrl` (string, opcional)
- `role` (string: `"admin" | "user"`)
- `createdAt` (datetime)

**Relaciones**

- 1 usuario → N posts
- 1 usuario → N comments
- 1 usuario → N likes

---

### `categories`

- `id` (string, autogenerado)
- `name` (string)
- `slug` (string)
- `description` (string, opcional)

**Relaciones**

- 1 categoría → N posts

---

### `posts`

- `id` (string, autogenerado)
- `title` (string)
- `image` (string)
- `duration` (number opcional por defecto null)
- `slug` (string)
- `content` (string largo / rich text)
- `excerpt` (string corto / medio)
- `authorId` (string, referencia a `users.id`)
- `tags` (lista de strings)
- `likesCount` (number, default: 0)
- `commentsCount` (number, default: 0)
- `published` (boolean: true | false)
- `createdAt` (datetime)
- `updatedAt` (datetime)

**Relaciones**

- 1 post → N comments
- 1 post → N likes

---

### `comments`

- `id` (string, autogenerado)
- `postId` (string, referencia a `posts.id`)
- `userId` (string, referencia a `users.id`)
- `content` (string)
- `parentId` (string, referencia opcional a `comments.id`)
- `createdAt` (datetime)
- `updatedAt` (datetime)

**Relaciones**

- 1 comentario → pertenece a 1 post
- 1 comentario → pertenece a 1 usuario
- 1 comentario → puede tener respuestas (self-relation con `parentId`)

---

### `likes`

- `id` (string, autogenerado)
- `postId` (string, referencia a `posts.id`)
- `userId` (string, referencia a `users.id`)
- `createdAt` (datetime)

**Relaciones**

- 1 like → pertenece a 1 post
- 1 like → pertenece a 1 usuario

**Restricción lógica**

- Un `userId` solo puede dar un like por `postId`.

---

## Triggers

### Likes

- **On like create**
  - Insertar en tabla `likes`.
  - Incrementar `posts.likesCount` en +1.

- **On like delete**
  - Eliminar de tabla `likes`.
  - Decrementar `posts.likesCount` en -1.

---

### Comments

- **On comment create**
  - Insertar en tabla `comments`.
  - Incrementar `posts.commentsCount` en +1.

- **On comment update**
  - Actualizar campo `content`.
  - Actualizar campo `updatedAt`.

- **On comment delete**
  - Eliminar de tabla `comments`.
  - Decrementar `posts.commentsCount` en -1.
  - Si el comentario tiene hijos (`parentId`), decidir en lógica si se borran en cascada o se marcan como eliminados.

---

### Posts

- **On post delete**
  - Eliminar el post.
  - Eliminar en cascada sus `comments` y `likes`.

  - **Posts**
  - Solo el autor del post puede editarlo.
  - Solo el autor o un usuario con `role = "admin"` puede eliminarlo.

---

### Users

- **On user create** (login Discord)
  - Insertar en tabla `users` si no existe.
  - Guardar `externalId`, `name`, `avatarUrl`, `role = "user"`.

- **On user update**
  - Actualizar `name`, `avatarUrl` o cualquier dato modificado desde Discord.

- **On user delete** (opcional, si se soporta)
  - Eliminar o anonimizar datos del usuario.
  - Manejar en cascada sus `posts`, `comments` y `likes` (ejemplo: marcar autor como “usuario eliminado”).

---

## Seguridad



- **Comments**
  - Solo el autor del comentario puede editarlo.
  - Solo el autor o un usuario con `role = "admin"` puede eliminarlo.

- **Likes**
  - Solo el usuario que dio el like puede eliminarlo.
  - No se permiten likes duplicados (`userId + postId` debe ser único).

- **Usuarios**
  - Solo administradores pueden cambiar el `role` de un usuario.
  - La eliminación de un usuario debe anonimizar o borrar sus datos según la política de privacidad.

- **General**
  - Todas las operaciones de escritura deben verificar autenticación (`userId` válido).
  - Las queries que devuelven datos sensibles (ej. emails de usuarios) deben restringirse a administradores
