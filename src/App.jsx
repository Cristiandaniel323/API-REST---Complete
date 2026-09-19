import React from "react";
import { NavLink, Route, Routes, Navigate } from "react-router-dom";
import Medias from "./pages/Medias";
import Generos from "./pages/Generos";
import Directores from "./pages/Directores";
import Productoras from "./pages/Productoras";
import Tipos from "./pages/Tipos";

export default function App() {
  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg navbar-dark app-navbar">
        <div className="container">
          <NavLink className="navbar-brand fw-bold" to="/medias">
            🎬 CineAdmin
          </NavLink>
          <div className="navbar-nav ms-auto">
            <NavLink className={({isActive}) => `nav-link ${isActive ? "active" : ""}`} to="/medias">
              Medias
            </NavLink>
            <NavLink className={({isActive}) => `nav-link ${isActive ? "active" : ""}`} to="/generos">
              Géneros
            </NavLink>
            <NavLink className={({isActive}) => `nav-link ${isActive ? "active" : ""}`} to="/directores">
              Directores
            </NavLink>
            <NavLink className={({isActive}) => `nav-link ${isActive ? "active" : ""}`} to="/productoras">
              Productora
            </NavLink>
            <NavLink className={({isActive}) => `nav-link ${isActive ? "active" : ""}`} to="/tipos">
              Tipo
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Navigate to="/medias" replace />} />
          <Route path="/medias" element={<Medias />} />
          <Route path="/generos" element={<Generos />} />
          <Route path="/directores" element={<Directores />} />
          <Route path="/productoras" element={<Productoras />} />
          <Route path="/tipos" element={<Tipos />} />
        </Routes>
      </main>
    </div>
  );
}