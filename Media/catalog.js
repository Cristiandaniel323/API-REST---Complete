const { resource, singular, fields } = window.CATALOG;
const API = `http://localhost:3000/api/${resource}`;
let items = [];
let editId = null;

const $ = s => document.querySelector(s);

async function getJson(url){
  const r = await fetch(url);
  if(!r.ok) throw new Error(await r.text());
  return r.json();
}
function datosDe(res){ return Array.isArray(res) ? res : (res?.datos || []); }

function campoHtml(f){
  const req = f.required ? "required" : "";
  if(f.type === "textarea"){
    return `<label class="full">${f.label}<textarea name="${f.name}" rows="4" ${req}></textarea></label>`;
  }
  if(f.type === "select"){
    const opts = f.options.map(o => `<option value="${o}">${o}</option>`).join("");
    return `<label>${f.label}<select name="${f.name}" ${req}>${opts}</select></label>`;
  }
  return `<label>${f.label}<input name="${f.name}" ${req}></label>`;
}

function renderTabla(){
  $("#tablaHead").innerHTML = fields.map(f => `<th>${f.label}</th>`).join("") + "<th>Acciones</th>";
  $("#tablaBody").innerHTML = items.map(it => `
    <tr>
      ${fields.map(f => `<td>${it[f.name] ?? "—"}</td>`).join("")}
      <td>
        <button class="action-btn edit" onclick="editar('${it._id}')">Editar</button>
        <button class="action-btn delete" onclick="eliminar('${it._id}')">Eliminar</button>
      </td>
    </tr>`).join("") || `<tr><td colspan="${fields.length + 1}">No hay registros.</td></tr>`;
}

async function cargar(){
  items = datosDe(await getJson(API));
  renderTabla();
}

function abrirNueva(){
  editId = null;
  $("#itemForm").reset();
  $("#formTitulo").textContent = `Nuevo${singular.endsWith("a") ? "a" : ""} ${singular}`;
  $("#modal").classList.remove("hidden");
}
function cerrar(){ $("#modal").classList.add("hidden"); }

window.editar = function(id){
  const item = items.find(x => x._id === id);
  if(!item) return;
  editId = id;
  $("#formTitulo").textContent = `Editar ${singular}`;
  const form = $("#itemForm");
  fields.forEach(f => { form.elements[f.name].value = item[f.name] ?? ""; });
  $("#modal").classList.remove("hidden");
};

window.eliminar = async function(id){
  const item = items.find(x => x._id === id);
  if(!confirm(`¿Desea eliminar "${item?.nombre || "este registro"}"?`)) return;
  const r = await fetch(`${API}/${id}`, { method: "DELETE" });
  if(!r.ok) return alert(`No fue posible eliminar ${singular.toLowerCase()}.`);
  await cargar();
};

function mensajeError(err){
  if(!err) return `No fue posible guardar ${singular.toLowerCase()}. Verifique los datos y la API.`;
  const detalles = err.detalles;
  if(Array.isArray(detalles)){
    return detalles.map(d => (typeof d === "string" ? d : d.mensaje)).join(" ");
  }
  return err.error || `No fue posible guardar ${singular.toLowerCase()}.`;
}

$("#itemForm").addEventListener("submit", async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const url = editId ? `${API}/${editId}` : API;
  const r = await fetch(url, {
    method: editId ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if(!r.ok){
    const err = await r.json().catch(() => null);
    alert(mensajeError(err));
    return;
  }
  cerrar();
  await cargar();
});

$("#camposForm").innerHTML = fields.map(campoHtml).join("");
$("#btnNueva").onclick = abrirNueva;
$("#btnCerrar").onclick = cerrar;
$("#btnCancelar").onclick = cerrar;

(async () => {
  try { await cargar(); }
  catch(e){ console.error(e); alert("No se pudo conectar con la API. Asegúrese de ejecutar el backend en http://localhost:3000."); }
})();
