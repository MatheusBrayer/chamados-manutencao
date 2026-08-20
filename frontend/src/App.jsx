import { useEffect, useState } from "react";
import API_BASE_URL from "./services/api";

function App() {
  const [indicadores, setIndicadores] = useState(null);

  useEffect(() => {
    console.log("Chamando API...");

    fetch(`${API_BASE_URL}/indicadores`)
      .then((response) => {
        console.log("Resposta recebida:", response);
        return response.json();
      })
      .then((data) => {
        console.log("Dados recebidos:", data);
        setIndicadores(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar indicadores:", error);
      });
  }, []);

  return (
    <div>
      <h1>Sistema de Chamados Mecânicos</h1>

      {indicadores ? (
        <div>
          <p>Total de chamados: {indicadores.totalChamados}</p>
          <p>Chamados de máquina: {indicadores.chamadosMaquina}</p>
          <p>Chamados prediais: {indicadores.chamadosPredial}</p>
        </div>
      ) : (
        <p>Carregando indicadores...</p>
      )}
    </div>
  );
}

export default App;