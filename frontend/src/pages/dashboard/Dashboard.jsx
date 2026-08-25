import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import "./Dashboard.css";
import GraficoPizza from "../../components/graficoPizza/GraficoPizza";
import GraficosMensais from "../../components/graficosMensais/GraficosMensais";

import {
  buscarIndicadores,
  buscarIndicadoresMensais,
} from "../../service/IndicadoresService";

function Dashboard() {
  const navegar = useNavigate();

  const [indicadores, definirIndicadores] = useState(null);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState("");
  const [indicadoresMensais, definirIndicadoresMensais] = useState([]);
  const [anoSelecionado, definirAnoSelecionado] = useState(
    new Date().getFullYear(),
  );

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  function sairDoSistema() {
    localStorage.removeItem("usuarioLogado");
    navegar("/login");
  }

  useEffect(() => {
    async function carregarDadosDashboard() {
      try {
        definirCarregando(true);
        definirErro("");

        const [dadosIndicadores, dadosMensais] = await Promise.all([
          buscarIndicadores(),
          buscarIndicadoresMensais(anoSelecionado),
        ]);

        definirIndicadores(dadosIndicadores);
        definirIndicadoresMensais(dadosMensais);
      } catch (erroRequisicao) {
        definirErro(erroRequisicao.message);
      } finally {
        definirCarregando(false);
      }
    }

    carregarDadosDashboard();
  }, [anoSelecionado]);

  if (carregando) {
    return <p className="mensagem-dashboard">Carregando indicadores...</p>;
  }

  if (erro) {
    return <p className="mensagem-dashboard mensagem-erro">{erro}</p>;
  }

  return (
    <main className="pagina-dashboard">
      <header className="cabecalho-dashboard">
        <div>
          <h1>Manutenção Vulcabras</h1>

          <p>Olá, {usuarioLogado?.nome || "Mecânico"}</p>

          <p>Visão geral dos registros de manutenção</p>
        </div>

        <nav className="navegacao-dashboard">
          <button type="button" onClick={() => navegar("/novo-registro")}>
            Novo Registro
          </button>

          <details className="menu-registros">
            <summary>Registros</summary>

            <div className="opcoes-registros">
              <button type="button" onClick={() => navegar("/chamados")}>
                Chamados
              </button>

              <button
                type="button"
                onClick={() => navegar("/registros/maquinas")}
              >
                Máquinas
              </button>

              <button
                type="button"
                onClick={() => navegar("/registros/mecanicos")}
              >
                Mecânicos
              </button>
            </div>
          </details>

          <button type="button" onClick={sairDoSistema}>
            Sair
          </button>
        </nav>
      </header>

      <section className="conteudo-dashboard">
        <div className="titulo-dashboard">
          <h2>Indicadores gerais</h2>

          <p>Resumo de todos os registros cadastrados.</p>
        </div>

        <div className="grade-indicadores">
          <article className="cartao-indicador cartao-total">
            <span>Total de chamados</span>

            <strong>{indicadores.totalChamados}</strong>
          </article>

          <article className="cartao-indicador cartao-maquina">
            <span>Chamados de máquina</span>

            <strong>{indicadores.chamadosMaquina}</strong>
          </article>

          <article className="cartao-indicador cartao-predial">
            <span>Chamados prediais</span>

            <strong>{indicadores.chamadosPredial}</strong>
          </article>
        </div>

        <section className="area-grafico">
          <div className="cabecalho-grafico">
            <h2>Distribuição dos chamados</h2>

            <p>Comparação entre chamados de máquina e chamados prediais.</p>
          </div>

          <GraficoPizza
            chamadosMaquina={indicadores.chamadosMaquina}
            chamadosPredial={indicadores.chamadosPredial}
          />

          <section className="area-evolucao-mensal">
            <div className="cabecalho-evolucao">
              <div>
                <h2>Evolução mensal</h2>

                <p>Acompanhe a quantidade de chamados ao longo do ano.</p>
              </div>

              <div className="campo-ano">
                <label htmlFor="ano-dashboard">Ano</label>

                <select
                  id="ano-dashboard"
                  value={anoSelecionado}
                  onChange={(evento) =>
                    definirAnoSelecionado(Number(evento.target.value))
                  }
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>
            </div>

            <GraficosMensais dadosMensais={indicadoresMensais} />
          </section>
        </section>
      </section>
    </main>
  );
}

export default Dashboard;
