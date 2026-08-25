const { validationResult } = require("express-validator");

function validarCampos(req, res, next) {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      error: "Error de validación",
      detalles: errores.array().map(({ path, msg }) => ({ campo: path, mensaje: msg }))
    });
  }

  next();
}

module.exports = validarCampos;
