# API REST - Sistema de Películas

API REST construida con **Node.js + Express + MongoDB + Mongoose**.

Está preparada para trabajar con la base de datos que aparece en MongoDB Compass:

- Base de datos: `peliculas`
- Colección: `medias`
- Colección: `directores`
- Colección: `generos`
- Colección: `tipo`
- Colección: `productora`

## 1. Requisitos

Instalar:

- Node.js
- MongoDB
- MongoDB Compass (opcional)
- Postman (opcional, recomendado para probar la API)

## 2. Instalar

Desde la carpeta del proyecto:

```bash
npm install
```

Este comando instala también `express-validator`, requerido para validar las solicitudes.

Crear `.env` copiando `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/peliculas
```

## Migración importante

La versión actual guarda `genero`, `director`, `productora` y `tipo` como IDs de MongoDB. Si existen documentos antiguos de `medias` con los campos `generoPrincipal`, `directorPrincipal`, `urlFilm` o `fotoPortada`, deben migrarse o recrearse antes de realizar las pruebas; esos documentos pertenecen al formato anterior.

## 3. Ejecutar

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

La API quedará disponible en:

```text
http://localhost:3000
```

## 4. Endpoints

### Películas / medias

```text
GET    /api/media
GET    /api/media/:id
POST   /api/media
PUT    /api/media/:id
DELETE /api/media/:id
```

Filtros:

```text
Las consultas GET de Media usan `populate()` para devolver los datos completos de género, director, productora y tipo.
```

### Directores

```text
GET    /api/director
GET    /api/director/:id
POST   /api/director
PUT    /api/director/:id
DELETE /api/director/:id
```

### Géneros

```text
GET    /api/genero
GET    /api/genero/:id
POST   /api/genero
PUT    /api/genero/:id
DELETE /api/genero/:id
```

### Tipos

```text
GET    /api/tipo
GET    /api/tipo/:id
POST   /api/tipo
PUT    /api/tipo/:id
DELETE /api/tipo/:id
```

### Productoras

```text
GET    /api/productora
GET    /api/productora/:id
POST   /api/productora
PUT    /api/productora/:id
DELETE /api/productora/:id
```

### Estado de la API

```text
GET /api/health
```

## 5. Ejemplo POST de película

Enviar en Postman:

```json
{
  "serial": "MEDIA-0006",
  "titulo": "Spider-Man 2",
  "sinopsis": "Peter Parker enfrenta nuevos desafíos mientras protege la ciudad.",
  "url": "https://media.iudigital.edu.co/films/spiderman-2004",
  "imagen": "https://media.iudigital.edu.co/portadas/spiderman.jpg",
  "anio": 2004,
  "genero": "ID_DEL_GENERO_ACTIVO",
  "director": "ID_DEL_DIRECTOR_ACTIVO",
  "productora": "ID_DE_LA_PRODUCTORA_ACTIVA",
  "tipo": "ID_DEL_TIPO_ACTIVO"
}
```

Las referencias deben ser IDs válidos de registros existentes y activos. Los campos `serial` y `url` son únicos.

## 6. Ejemplo POST de director

```json
{
  "nombre": "James Cameron",
  "estado": "Activo"
}
```

## 7. Ejemplo POST de género

```json
{
  "nombre": "Comedia",
  "estado": "Activo",
  "descripcion": "Películas enfocadas en situaciones humorísticas."
}
```

## 8. Arquitectura

```text
api-rest-peliculas/
├── models/
│   ├── Media.js
│   ├── Director.js
│   ├── Genero.js
│   ├── Tipo.js
│   └── Productora.js
├── routes/
│   ├── crudFactory.js
│   ├── media.routes.js
│   ├── director.routes.js
│   ├── genero.routes.js
│   ├── tipo.routes.js
│   └── productora.routes.js
├── middleware/
│   └── validarCampos.js
├── db/
│   └── db-connection-mongo.js
├── .env.example
├── package.json
├── index.js
├── server.js
└── README.md
```
