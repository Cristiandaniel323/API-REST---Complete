const Productora = require("../models/Productora");
const createCrudRouter = require("./crudFactory");

module.exports = createCrudRouter(Productora, { requiredFields: ["nombre", "estado", "slogan", "descripcion"], hasEstado: true });
