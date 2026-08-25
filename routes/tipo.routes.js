const Tipo = require("../models/Tipo");
const createCrudRouter = require("./crudFactory");

module.exports = createCrudRouter(Tipo, { requiredFields: ["nombre", "estado", "descripcion"], hasEstado: true });
