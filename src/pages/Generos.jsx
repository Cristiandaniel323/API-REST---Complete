import MasterCrud from "../components/MasterCrud"; 
import { 
    generoApi 
}

from "../api";
export default () => <MasterCrud title="Géneros" description="Administración de géneros para películas y series." api= {
    generoApi
} 

fields={
    [{ name: "nombre", label: "Nombre", required: true }, { name: "estado", label: "Estado", type: "select", initial: "Activo", options: ["Activo", "Inactivo"] }, { name: "descripcion", label: "Descripción", type: "textarea", col: "col-12" }]} />;
