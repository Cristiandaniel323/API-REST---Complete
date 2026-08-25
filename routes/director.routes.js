const Director = require("../models/Director");
const createCrudRouter = require("./crudFactory");

module.exports = createCrudRouter(Director, { requiredFields: ["nombre", "estado"], hasEstado: true });
