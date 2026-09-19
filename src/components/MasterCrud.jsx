import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getId, getItems } from "../api";

function buildForm(fields) {
  const form = {};
  fields.forEach((f) => { form[f.name] = f.initial ?? ""; });
  return form;
}

export default function MasterCrud({ title, description, api, fields }) {
  const initialForm = buildForm(fields);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargar = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.listar();
      setItems(getItems(res));
    } catch {
      setError(`No fue posible consultar ${title.toLowerCase()}. Verifica que la API esté ejecutándose.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const cancelar = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const guardar = async (e) => {
    e.preventDefault();
    const faltante = fields.find((f) => f.required && !String(form[f.name] ?? "").trim());
    if (faltante) {
      Swal.fire("Falta información", `${faltante.label} es obligatorio.`, "warning");
      return;
    }
    try {
      if (editingId) {
        await api.actualizar(editingId, form);
        Swal.fire("Actualizado", "El registro fue actualizado correctamente.", "success");
      } else {
        await api.crear(form);
        Swal.fire("Registrado", "El registro fue creado correctamente.", "success");
      }
      cancelar();
      cargar();
    } catch (err) {
      const detalles = err.response?.data?.detalles;
      const mensaje = Array.isArray(detalles)
        ? detalles.map((d) => (typeof d === "string" ? d : d.mensaje)).join(" ")
        : err.response?.data?.error || "La operación no pudo completarse. Revisa los datos y la API.";
      Swal.fire("Error", mensaje, "error");
    }
  };

  const editar = (item) => {
    setEditingId(getId(item));
    const next = {};
    fields.forEach((f) => { next[f.name] = item[f.name] ?? ""; });
    setForm(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminar = async (item) => {
    const result = await Swal.fire({
      title: "¿Eliminar registro?",
      text: `Se eliminará "${item.nombre || item.nombres || ""}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      await api.eliminar(getId(item));
      Swal.fire("Eliminado", "El registro fue eliminado.", "success");
      cargar();
    } catch {
      Swal.fire("Error", "No se pudo eliminar el registro.", "error");
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="card-title">{editingId ? "Editar registro" : "Registrar nuevo"}</h5>
          <form onSubmit={guardar} className="row g-3">
            {fields.map((f) => {
              const col = f.col || (f.type === "textarea" ? "col-12" : "col-md-4");
              return (
                <div className={col} key={f.name}>
                  <label className="form-label">{f.label}{f.required ? " *" : ""}</label>
                  {f.type === "textarea" ? (
                    <textarea className="form-control" name={f.name} rows="3" value={form[f.name]} onChange={handleChange} />
                  ) : f.type === "select" ? (
                    <select className="form-select" name={f.name} value={form[f.name]} onChange={handleChange}>
                      {(f.options || []).map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input className="form-control" name={f.name} value={form[f.name]} onChange={handleChange} />
                  )}
                </div>
              );
            })}
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-primary" type="submit">{editingId ? "Guardar cambios" : "Registrar"}</button>
              {editingId && <button className="btn btn-outline-secondary" type="button" onClick={cancelar}>Cancelar</button>}
            </div>
          </form>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Listado</h5>
            <button className="btn btn-outline-dark btn-sm" onClick={cargar}>↻ Actualizar</button>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  {fields.map((f) => <th key={f.name}>{f.label}</th>)}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={fields.length + 1} className="text-center py-4">Cargando...</td></tr>
                ) : items.length === 0 ? (
                  <tr><td colSpan={fields.length + 1} className="text-center py-4">No hay registros.</td></tr>
                ) : items.map((item) => (
                  <tr key={getId(item)}>
                    {fields.map((f) => (
                      <td key={f.name}>
                        {f.type === "select" ? (
                          <span className={`badge ${item[f.name] === "Activo" ? "text-bg-success" : "text-bg-secondary"}`}>{item[f.name]}</span>
                        ) : (item[f.name] || "—")}
                      </td>
                    ))}
                    <td className="text-nowrap">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editar(item)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(item)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
