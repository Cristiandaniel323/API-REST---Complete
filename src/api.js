import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" }
});

export const getId = (item) => item?._id ?? item?.id;

export const getItems = (res) => {
  const data = res?.data ?? res;
  return Array.isArray(data) ? data : (data?.datos || data?.data || []);
};

function crud(resource) {
  return {
    listar: () => api.get(`/${resource}`),
    obtener: (id) => api.get(`/${resource}/${id}`),
    crear: (data) => api.post(`/${resource}`, data),
    actualizar: (id, data) => api.put(`/${resource}/${id}`, data),
    eliminar: (id) => api.delete(`/${resource}/${id}`)
  };
}

export const productoraApi = crud("productoras");
export const tipoApi = crud("tipos");
export const directorApi = crud("directores");
export const generoApi = crud("generos");
export const mediaApi = crud("media");
