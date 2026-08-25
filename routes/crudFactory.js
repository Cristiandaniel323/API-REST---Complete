function createCrudRouter(Model, options = {}) {
  const express = require("express");
  const { body, param } = require("express-validator");
  const validarCampos = require("../middleware/validarCampos");
  const router = express.Router();

  const idField = options.idField || "_id";
  const requiredFields = options.requiredFields || ["nombre"];
  const validationRules = [
    ...requiredFields.map((field) =>
      body(field).trim().notEmpty().withMessage(`${field} es obligatorio`)
    ),
    ...(options.hasEstado
      ? [body("estado").isIn(["Activo", "Inactivo"]).withMessage("El estado debe ser Activo o Inactivo")]
      : [])
  ];
  const idRule = [param("id").isMongoId().withMessage("El ID no tiene un formato válido"), validarCampos];

  router.get("/", async (req, res, next) => {
    try {
      const filter = {};

      if (req.query.nombre) {
        filter.nombre = { $regex: req.query.nombre, $options: "i" };
      }

      if (req.query.estado) {
        filter.estado = req.query.estado;
      }

      const data = await Model.find(filter).sort({ nombre: 1 });
      res.json({
        total: data.length,
        datos: data
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", idRule, async (req, res, next) => {
    try {
      const data = await Model.findOne({ [idField]: req.params.id });

      if (!data) {
        return res.status(404).json({ error: "Registro no encontrado" });
      }

      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  router.post("/", validationRules, validarCampos, async (req, res, next) => {
    try {
      const data = await Model.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", idRule, validationRules, validarCampos, async (req, res, next) => {
    try {
      const data = await Model.findOneAndUpdate(
        { [idField]: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!data) {
        return res.status(404).json({ error: "Registro no encontrado" });
      }

      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", idRule, async (req, res, next) => {
    try {
      const data = await Model.findOneAndDelete({ [idField]: req.params.id });

      if (!data) {
        return res.status(404).json({ error: "Registro no encontrado" });
      }

      res.json({
        mensaje: "Registro eliminado correctamente",
        datos: data
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = createCrudRouter;
