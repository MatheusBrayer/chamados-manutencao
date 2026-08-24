import { Navigate, Route, Routes } from "react-router";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import NovoRegistro from "./pages/novoRegistro/NovoRegistro";
import Chamados from "./pages/chamados/Chamados";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/novo-registro" element={<NovoRegistro />} />

      <Route path="/chamados" element={<Chamados />} />

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
export default App;
