import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import "./GraficoPizza.css";

const CORES = {
  maquina: "#12824c",
  predial: "#e67b00",
};

function GraficoPizza({ chamadosMaquina = 0, chamadosPredial = 0 }) {
  const quantidadeMaquina = Number(chamadosMaquina) || 0;
  const quantidadePredial = Number(chamadosPredial) || 0;

  const totalChamados = quantidadeMaquina + quantidadePredial;

  const dadosGrafico = [
    {
      nome: "Máquina",
      quantidade: quantidadeMaquina,
      cor: CORES.maquina,
    },
    {
      nome: "Predial",
      quantidade: quantidadePredial,
      cor: CORES.predial,
    },
  ];

  function formatarTooltip(valor, nome) {
    const porcentagem =
      totalChamados > 0 ? (Number(valor) / totalChamados) * 100 : 0;

    return [`${valor} chamado(s) - ${porcentagem.toFixed(1)}%`, nome];
  }

  function renderizarRotulo({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    value,
    fill,
  }) {
    if (!value || percent === 0) {
      return null;
    }

    const anguloEmRadianos = (-midAngle * Math.PI) / 180;

    const raio = outerRadius + 16;

    const x = cx + raio * Math.cos(anguloEmRadianos);

    const y = cy + raio * Math.sin(anguloEmRadianos);

    return (
      <text
        x={x}
        y={y}
        fill={fill}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="rotulo-grafico-pizza"
      >
        {(percent * 100).toFixed(1)}%
      </text>
    );
  }

  function renderizarLegenda({ payload }) {
    return (
      <div className="legenda-grafico-pizza">
        {payload.map((item) => {
          const dado = item.payload;

          return (
            <div className="item-legenda-pizza" key={dado.nome}>
              <span
                className="cor-legenda-pizza"
                style={{
                  backgroundColor: dado.cor,
                }}
              />

              <span>{dado.nome}</span>

              <strong>{dado.quantidade}</strong>
            </div>
          );
        })}
      </div>
    );
  }

  if (totalChamados === 0) {
    return (
      <div className="grafico-sem-dados">
        <p>Ainda não existem chamados para exibir.</p>
      </div>
    );
  }

  return (
    <div className="grafico-pizza">
      <div className="area-visual-grafico-pizza">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart
            margin={{
              top: 20,
              right: 48,
              bottom: 20,
              left: 48,
            }}
          >
            <Pie
              data={dadosGrafico}
              dataKey="quantidade"
              nameKey="nome"
              cx="50%"
              cy="48%"
              innerRadius="53%"
              outerRadius="76%"
              paddingAngle={
                quantidadeMaquina > 0 && quantidadePredial > 0 ? 3 : 0
              }
              cornerRadius={6}
              stroke="#ffffff"
              strokeWidth={3}
              labelLine={false}
              label={renderizarRotulo}
              isAnimationActive
              animationDuration={700}
            >
              {dadosGrafico.map((item) => (
                <Cell key={item.nome} fill={item.cor} />
              ))}
            </Pie>

            <Tooltip
              formatter={formatarTooltip}
              contentStyle={{
                border: "none",
                borderRadius: "10px",
                boxShadow: "0 8px 24px rgba(16, 24, 40, 0.14)",
              }}
            />

            <Legend content={renderizarLegenda} />
          </PieChart>
        </ResponsiveContainer>

        <div className="total-centro-pizza" aria-hidden="true">
          <strong>{totalChamados}</strong>
          <span>{totalChamados === 1 ? "chamado" : "chamados"}</span>
        </div>
      </div>
    </div>
  );
}

export default GraficoPizza;
