const Genero = require("../models/Genero");
const createCrudRouter = require("./crudFactory");

module.exports = createCrudRouter(Genero, { requiredFields: ["nombre", "estado", "descripcion"], hasEstado: true });
