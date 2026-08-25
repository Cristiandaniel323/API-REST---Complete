const express = require("express");
const { body, param } = require("express-validator");
const mongoose = require("mongoose");
const Media = require("../models/Media");
const Director = require("../models/Director");
const Genero = require("../models/Genero");
const Productora = require("../models/Productora");
const Tipo = require("../models/Tipo");
const validarCampos = require("../middleware/validarCampos");

const router = express.Router();
const poblacion = ["genero", "director", "productora", "tipo"];
const reglasMedia = [
  body("serial").trim().notEmpty().withMessage("El serial es obligatorio"),
  body("titulo").trim().notEmpty().withMessage("El título es obligatorio"),
  body("sinopsis").trim().notEmpty().withMessage("La sinopsis es obligatoria"),
  body("url").trim().notEmpty().withMessage("La URL es obligatoria").bail().isURL().withMessage("La URL debe tener un formato válido"),
  body("imagen").trim().notEmpty().withMessage("La imagen es obligatoria").bail().isURL().withMessage("La imagen debe tener un formato válido"),
  body("anio").isInt({ min: 1888, max: 2100 }).withMessage("El año debe estar entre 1888 y 2100"),
  body("genero").isMongoId().withMessage("El ID de género no es válido"),
  body("director").isMongoId().withMessage("El ID de director no es válido"),
  body("productora").isMongoId().withMessage("El ID de productora no es válido"),
  body("tipo").isMongoId().withMessage("El ID de tipo no es válido")
];

async function validarReferenciasActivas(body) {
  const referencias = [[Genero, body.genero, "Género"], [Director, body.director, "Director"], [Productora, body.productora, "Productora"], [Tipo, body.tipo, "Tipo"]];
  const errores = [];
  for (const [Modelo, id, nombre] of referencias) {
    if (!(await Modelo.exists({ _id: id, estado: "Activo" }))) errores.push(`${nombre} no existe o está inactivo`);
  }
  return errores;
}

async function buscarPorIdOSerial(valor) {
  return Media.findOne(mongoose.isValidObjectId(valor) ? { $or: [{ _id: valor }, { serial: valor }] } : { serial: valor });
}

async function validarUnicidad(body, idActual) {
  const filtro = { $or: [{ serial: body.serial }, { url: body.url }] };
  if (idActual) filtro._id = { $ne: idActual };
  const existente = await Media.findOne(filtro);
  if (!existente) return [];
  return [
    ...(existente.serial === body.serial ? ["El serial ya existe"] : []),
    ...(existente.url === body.url ? ["La URL ya existe"] : [])
  ];
}

router.get("/", async (req, res, next) => {
  try {
    const datos = await Media.find().populate(poblacion).sort({ titulo: 1 });
    res.status(200).json({ total: datos.length, datos });
  } catch (error) { next(error); }
});

router.get("/:id", [param("id").notEmpty().withMessage("El ID es obligatorio"), validarCampos], async (req, res, next) => {
  try {
    const data = await buscarPorIdOSerial(req.params.id);
    if (!data) return res.status(404).json({ error: "Media no encontrada" });
    await data.populate(poblacion);
    res.status(200).json(data);
  } catch (error) { next(error); }
});

router.post("/", reglasMedia, validarCampos, async (req, res, next) => {
  try {
    const errores = [...(await validarReferenciasActivas(req.body)), ...(await validarUnicidad(req.body))];
    if (errores.length) return res.status(400).json({ error: "Error de validación", detalles: errores });
    const data = await Media.create(req.body);
    await data.populate(poblacion);
    res.status(201).json(data);
  } catch (error) { next(error); }
});

router.put("/:id", [param("id").notEmpty().withMessage("El ID es obligatorio"), ...reglasMedia, validarCampos], async (req, res, next) => {
  try {
    const actual = await buscarPorIdOSerial(req.params.id);
    if (!actual) return res.status(404).json({ error: "Media no encontrada" });
    const errores = [...(await validarReferenciasActivas(req.body)), ...(await validarUnicidad(req.body, actual._id))];
    if (errores.length) return res.status(400).json({ error: "Error de validación", detalles: errores });
    Object.assign(actual, req.body);
    await actual.save();
    await actual.populate(poblacion);
    res.status(200).json(actual);
  } catch (error) { next(error); }
});

router.delete("/:id", [param("id").notEmpty().withMessage("El ID es obligatorio"), validarCampos], async (req, res, next) => {
  try {
    const data = await buscarPorIdOSerial(req.params.id);
    if (!data) return res.status(404).json({ error: "Media no encontrada" });
    await data.deleteOne();
    res.status(200).json({ mensaje: "Media eliminada correctamente", datos: data });
  } catch (error) { next(error); }
});

module.exports = router;
