const API = "http://localhost:3000/api";
let medias = [];
let editId = null;

const $ = s => document.querySelector(s);

async function getJson(url){
  const r = await fetch(url);
  if(!r.ok) throw new Error(await r.text());
  return r.json();
}

function idOf(x){ return x?._id || x?.id || x; }
function nameOf(x){ return x?.nombre || x?.name || x?.titulo || "—"; }

function datosDe(res){ return Array.isArray(res) ? res : (res?.datos || []); }

async function cargarCatalogos(){
  const [generos,directores,productoras,tipos] = (await Promise.all([
    getJson(`${API}/genero`), getJson(`${API}/director`),
    getJson(`${API}/productora`), getJson(`${API}/tipo`)
  ])).map(datosDe);
  llenarSelect("#genero", generos, "Seleccione un género");
  llenarSelect("#director", directores, "Seleccione un director");
  llenarSelect("#productora", productoras, "Seleccione una productora");
  llenarSelect("#tipo", tipos, "Seleccione un tipo");
  llenarSelect("#filtroTipo", tipos, "Todos los tipos", true);
}
function llenarSelect(selector, items, placeholder, includeAll=false){
  const s=$(selector);
  s.innerHTML=`<option value="">${placeholder}</option>`;
  (items||[]).forEach(x=>{
    const o=document.createElement("option");
    o.value=idOf(x); o.textContent=nameOf(x); s.appendChild(o);
  });
}

async function cargarMedias(){
  medias = datosDe(await getJson(`${API}/media`));
  render();
}
function render(){
  const q=$("#buscar").value.toLowerCase();
  const tipo=$("#filtroTipo").value;
  const rows=medias.filter(m=>{
    const text=`${m.serial||""} ${m.titulo||""}`.toLowerCase();
    return text.includes(q) && (!tipo || idOf(m.tipo)===tipo);
  });
  $("#tablaMedias").innerHTML=rows.map(m=>`
    <tr>
      <td><img src="${m.imagen||""}" alt="Portada"></td>
      <td>${m.serial||"—"}</td>
      <td><strong>${m.titulo||"—"}</strong></td>
      <td>${m.anio||"—"}</td>
      <td>${nameOf(m.genero)}</td>
      <td>${nameOf(m.director)}</td>
      <td>${nameOf(m.productora)}</td>
      <td>${nameOf(m.tipo)}</td>
      <td>
        <button class="action-btn edit" onclick="editar('${m._id}')">Editar</button>
        <button class="action-btn delete" onclick="eliminar('${m._id}')">Eliminar</button>
      </td>
    </tr>`).join("") || `<tr><td colspan="9">No hay medias registradas.</td></tr>`;
}

function abrirNueva(){
  editId=null; $("#mediaForm").reset(); $("#formTitulo").textContent="Nueva Media";
  $("#modal").classList.remove("hidden");
}
function cerrar(){ $("#modal").classList.add("hidden"); }

async function editar(id){
  const m=await getJson(`${API}/media/${id}`);
  editId=id; $("#formTitulo").textContent="Editar Media";
  const f=$("#mediaForm");
  for(const key of ["serial","titulo","sinopsis","url","imagen","anio"]) f.elements[key].value=m[key]??"";
  ["genero","director","productora","tipo"].forEach(k=>f.elements[k].value=idOf(m[k])||"");
  $("#modal").classList.remove("hidden");
}

async function eliminar(id){
  const m=medias.find(x=>x._id===id);
  if(!confirm(`¿Desea eliminar "${m?.titulo||"esta media"}"?`)) return;
  const r=await fetch(`${API}/media/${id}`,{method:"DELETE"});
  if(!r.ok) return alert("No fue posible eliminar la media.");
  await cargarMedias();
}

$("#mediaForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(e.target).entries());
  data.anio=Number(data.anio);
  const url=editId?`${API}/media/${editId}`:`${API}/media`;
  const r=await fetch(url,{method:editId?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
  if(!r.ok){ alert("No fue posible guardar la media. Verifique los datos y la API."); return; }
  cerrar(); await cargarMedias();
});

$("#btnNueva").onclick=abrirNueva;
$("#btnCerrar").onclick=cerrar;
$("#btnCancelar").onclick=cerrar;
$("#buscar").oninput=render;
$("#filtroTipo").onchange=render;

(async()=>{
  try{ await cargarCatalogos(); await cargarMedias(); }
  catch(e){ console.error(e); alert("No se pudo conectar con la API. Asegúrese de ejecutar el backend en http://localhost:3000."); }
})();
