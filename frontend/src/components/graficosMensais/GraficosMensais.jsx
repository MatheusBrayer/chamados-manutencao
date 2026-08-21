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
            <LineChart data={dadosFormatados}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="nomeMes" />

              <YAxis allowDecimals={false} domain={[0, "auto"]} />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="chamadosMaquina"
                name="Máquina"
                stroke="#0f7a4b"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />

              <Line
                type="monotone"
                dataKey="chamadosPredial"
                name="Predial"
                stroke="#d97706"
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
            <LineChart data={dadosFormatados}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="nomeMes" />

              <YAxis allowDecimals={false} domain={[0, "auto"]} />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="totalChamados"
                name="Total"
                stroke="#155eef"
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
