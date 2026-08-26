import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import "./GraficosMensais.css";

const NOMES_MESES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function GraficosMensais({ dadosMensais }) {
  const dadosFormatados = dadosMensais.map((indicador) => ({
    ...indicador,
    nomeMes: NOMES_MESES[indicador.mes - 1],
  }));

  return (
    <section className="secao-graficos-mensais">
      <article className="cartao-grafico-mensal">
        <div className="cabecalho-grafico-mensal">
          <h2>Chamados por tipo</h2>

          <p>Comparação mensal entre chamados de máquina e prediais.</p>
        </div>

        <div className="conteudo-grafico-mensal">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={dadosFormatados}
              margin={{
                top: 10,
                right: 12,
                bottom: 10,
                left: -18,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="nomeMes"
                interval={0}
                tick={{ fontSize: 12 }}
                tickMargin={8}
              />

              <YAxis
                allowDecimals={false}
                domain={[0, "auto"]}
                width={34}
                tick={{ fontSize: 12 }}
              />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="chamadosMaquina"
                name="Máquina"
                stroke="var(--cor-verde)"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />

              <Line
                type="monotone"
                dataKey="chamadosPredial"
                name="Predial"
                stroke="var(--cor-amarelo)"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="cartao-grafico-mensal">
        <div className="cabecalho-grafico-mensal">
          <h2>Total de chamados</h2>

          <p>Evolução mensal da quantidade total de chamados.</p>
        </div>

        <div className="conteudo-grafico-mensal">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={dadosFormatados}
              margin={{
                top: 10,
                right: 12,
                bottom: 10,
                left: -18,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="nomeMes"
                interval={0}
                tick={{ fontSize: 12 }}
                tickMargin={8}
              />

              <YAxis
                allowDecimals={false}
                domain={[0, "auto"]}
                width={34}
                tick={{ fontSize: 12 }}
              />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="totalChamados"
                name="Total"
                stroke="var(--cor-azul)"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}

export default GraficosMensais;
