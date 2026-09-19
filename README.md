# Frontend React – Productora y Tipo

Proyecto para la Evidencia de Aprendizaje 2 – Front End ReactJS de Ingeniería Web II.

## Módulos incluidos

### Productora
Según el caso de estudio, almacena:
- Nombre de la productora
- Estado (Activo/Inactivo)
- Fecha de creación (gestionada por el backend)
- Fecha de actualización (gestionada por el backend)
- Slogan
- Descripción

La interfaz permite listar, registrar, editar y eliminar.

### Tipo
Según el caso de estudio, almacena:
- Nombre
- Fecha de creación (gestionada por el backend)
- Fecha de actualización (gestionada por el backend)
- Descripción

La interfaz permite listar, registrar, editar y eliminar. Los tipos iniciales indicados en el caso son Serie y Película.

## Instalación

1. Instalar Node.js.
2. Abrir una terminal en esta carpeta.
3. Ejecutar:

```bash
npm install
```

4. Copiar `.env.example` como `.env`.
5. Cambiar `VITE_API_URL` por la URL real de la API desarrollada en EA1.
6. Ejecutar:

```bash
npm run dev
```

## Importante: endpoints

Este frontend asume estos endpoints REST:

- GET    /productoras
- POST   /productoras
- PUT    /productoras/:id
- DELETE /productoras/:id

- GET    /tipos
- POST   /tipos
- PUT    /tipos/:id
- DELETE /tipos/:id

Si en la EA1 los endpoints tienen otro nombre, solo debes modificar `src/api.js`.

El frontend también acepta respuestas tipo arreglo (`[]`) o respuestas envueltas como `{ data: [] }`.

## Nota sobre el caso

El caso de estudio indica que la aplicación es para administración de películas y que la Productora debe poder seleccionarse posteriormente desde el módulo Media únicamente entre productoras activas. El módulo Tipo se relacionará de la misma manera con Media.