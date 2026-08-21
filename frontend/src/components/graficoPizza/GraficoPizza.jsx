import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import "./GraficoPizza.css";

const CORES = ["#0f7a4b", "#d97706"];

function GraficoPizza({ chamadosMaquina, chamadosPredial }) {
  const totalChamados = chamadosMaquina + chamadosPredial;

  const dadosGrafico = [
    {
      nome: "Máquina",
      quantidade: chamadosMaquina,
    },
    {
      nome: "Predial",
      quantidade: chamadosPredial,
    },
  ];

  function formatarPorcentagem(valor) {
    if (totalChamados === 0) {
      return "0%";
    }

    const porcentagem = (valor / totalChamados) * 100;

    return `${porcentagem.toFixed(1)}%`;
  }

  function renderizarRotulo({ value }) {
    return formatarPorcentagem(value);
  }

  if (totalChamados === 0) {
    return (
      <div className="grafico-sem-dados">
        <p>Não existem chamados para exibir no gráfico.</p>
      </div>
    );
  }

  return (
    <div className="grafico-pizza">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={dadosGrafico}
            dataKey="quantidade"
            nameKey="nome"
            cx="50%"
            cy="45%"
            innerRadius={0}
            outerRadius={100}
            paddingAngle={0}
            label={renderizarRotulo}
          >
            {dadosGrafico.map((item, indice) => (
              <Cell key={`fatia-${item.nome}`} fill={CORES[indice]} />
            ))}
          </Pie>

          <Tooltip formatter={(valor, nome) => [`${valor} chamado(s)`, nome]} />

          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoPizza;
