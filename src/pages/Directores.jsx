import MasterCrud from "../components/MasterCrud";
import { directorApi } from "../api";

export default () => (
  <MasterCrud
    title="Directores"
    description="Administración de directores."
    api={directorApi}
    fields={[
      { name: "nombre", label: "Nombre", required: true },
      { name: "estado", label: "Estado", type: "select", initial: "Activo", options: ["Activo", "Inactivo"] }
    ]}
  />
);
