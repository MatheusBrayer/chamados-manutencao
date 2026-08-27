import { Navigate, Route, Routes } from "react-router";

import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import NovoRegistro from "./pages/novoRegistro/NovoRegistro";
import Chamados from "./pages/chamados/Chamados";
import Mecanicos from "./pages/mecanicos/Mecanicos";
import Maquinas from "./pages/maquinas/Maquinas";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/novo-registro" element={<NovoRegistro />} />

      <Route path="/chamados" element={<Chamados />} />

      <Route path="/registros/mecanicos" element={<Mecanicos />} />

      <Route path="/registros/maquinas" element={<Maquinas />} />

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
export default App;
