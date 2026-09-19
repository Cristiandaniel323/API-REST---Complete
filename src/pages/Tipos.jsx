import MasterCrud from "../components/MasterCrud"; import { tipoApi } from "../api";
export default () => <MasterCrud title="Tipos" description="Tipos de producción: película, serie u otros." api={tipoApi} fields={[{ name: "nombre", label: "Nombre", required: true }, { name: "descripcion", label: "Descripción", type: "textarea", col: "col-md-8" }]} />;
