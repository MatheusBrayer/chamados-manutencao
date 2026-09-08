import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import "./Dashboard.css";
import GraficoPizza from "../../components/graficoPizza/GraficoPizza";
import GraficosMensais from "../../components/graficosMensais/GraficosMensais";

import {
  buscarIndicadores,
  buscarIndicadoresMensais,
  buscarIndicadoresMecanicos,
} from "../../service/IndicadoresService";

const NOMES_MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function Dashboard() {
  const navegar = useNavigate();

  const [menuAberto, definirMenuAberto] = useState(false);

  const [mesSelecionado, definirMesSelecionado] = useState("");
  const [anoSelecionado, definirAnoSelecionado] = useState(
    new Date().getFullYear(),
  );

  const [mesFiltrado, definirMesFiltrado] = useState("");
  const [anoFiltrado, definirAnoFiltrado] = useState(new Date().getFullYear());

  const [indicadores, definirIndicadores] = useState(null);
  const [indicadoresMensais, definirIndicadoresMensais] = useState([]);
  const [indicadoresMecanicos, definirIndicadoresMecanicos] = useState([]);

  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState("");

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  function sairDoSistema() {
    localStorage.removeItem("usuarioLogado");
    navegar("/login");
  }

  function obterPeriodo(ano, mes) {
    if (!mes) {
      return {
        dataInicio: `${ano}-01-01`,
        dataFim: `${ano}-12-31`,
      };
    }

    const mesFormatado = String(mes).padStart(2, "0");

    const ultimoDia = new Date(ano, Number(mes), 0).getDate();

    return {
      dataInicio: `${ano}-${mesFormatado}-01`,
      dataFim: `${ano}-${mesFormatado}-${String(ultimoDia).padStart(2, "0")}`,
    };
  }

  async function carregarDadosDashboard(mes = mesFiltrado, ano = anoFiltrado) {
    try {
      definirCarregando(true);
      definirErro("");

      const periodo = obterPeriodo(ano, mes);

      const filtros = {
        dataInicio: periodo.dataInicio,
        dataFim: periodo.dataFim,
      };

      const [
        dadosIndicadores,
        dadosIndicadoresMensais,
        dadosIndicadoresMecanicos,
      ] = await Promise.all([
        buscarIndicadores(filtros),
        buscarIndicadoresMensais(ano),
        buscarIndicadoresMecanicos(filtros),
      ]);

      definirIndicadores(dadosIndicadores);
      definirIndicadoresMensais(dadosIndicadoresMensais);
      definirIndicadoresMecanicos(dadosIndicadoresMecanicos);
    } catch (erroRequisicao) {
      definirErro(erroRequisicao.message);
    } finally {
      definirCarregando(false);
    }
  }

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  function filtrarDashboard() {
    definirMesFiltrado(mesSelecionado);
    definirAnoFiltrado(anoSelecionado);

    carregarDadosDashboard(mesSelecionado, anoSelecionado);
  }

  if (carregando) {
    return <p className="mensagem-dashboard">Carregando indicadores...</p>;
  }

  if (erro) {
    return <p className="mensagem-dashboard mensagem-erro">{erro}</p>;
  }

  return (
    <main className="pagina-dashboard">
      <header className="cabecalho-dashboard">
        <div className="topo-cabecalho-dashboard">
          <div className="identificacao-dashboard">
            <h1>Manutenção Vulcabras</h1>
            <p>Olá, {usuarioLogado?.nome || "Usuário"}</p>
          </div>

          <button
            type="button"
            className="botao-menu-dashboard"
            onClick={() => definirMenuAberto((estadoAtual) => !estadoAtual)}
            aria-expanded={menuAberto}
            aria-controls="navegacao-dashboard"
          >
            {menuAberto ? "Fechar" : "Menu"}
          </button>
        </div>

        <nav
          id="navegacao-dashboard"
          className={
            menuAberto
              ? "navegacao-dashboard navegacao-aberta"
              : "navegacao-dashboard"
          }
        >
          <button
            type="button"
            onClick={() => {
              navegar("/dashboard");
              definirMenuAberto(false);
            }}
          >
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => {
              navegar("/novo-registro");
              definirMenuAberto(false);
            }}
          >
            Novo Registro
          </button>

          <details className="menu-registros">
            <summary>Registros</summary>

            <div className="opcoes-registros">
              <button
                type="button"
                onClick={() => {
                  navegar("/chamados");
                  definirMenuAberto(false);
                }}
              >
                Chamados
              </button>

              <button
                type="button"
                onClick={() => {
                  navegar("/registros/maquinas");
                  definirMenuAberto(false);
                }}
              >
                Máquinas
              </button>

              <button
                type="button"
                onClick={() => {
                  navegar("/registros/mecanicos");
                  definirMenuAberto(false);
                }}
              >
                Mecânicos
              </button>
            </div>
          </details>

          <button
            type="button"
            className="botao-sair-dashboard"
            onClick={sairDoSistema}
          >
            Sair
          </button>
        </nav>
      </header>

      <section className="conteudo-dashboard">
        <div className="titulo-dashboard">
          <h2>Indicadores de manutenção</h2>
          <p>Acompanhe os chamados e a produtividade da manutenção.</p>
        </div>

        {/* FILTROS */}
        <section className="filtros-dashboard">
          <div className="campo-filtro-dashboard">
            <label htmlFor="mes-dashboard">Mês</label>

            <select
              id="mes-dashboard"
              value={mesSelecionado}
              onChange={(evento) => definirMesSelecionado(evento.target.value)}
            >
              <option value="">Todos os meses</option>

              {NOMES_MESES.map((nome, indice) => (
                <option key={indice + 1} value={indice + 1}>
                  {nome}
                </option>
              ))}
            </select>
          </div>

          <div className="campo-filtro-dashboard">
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

          <div className="acoes-filtros-dashboard">
            <button
              type="button"
              className="botao-filtrar-dashboard"
              onClick={filtrarDashboard}
            >
              Filtrar
            </button>

            <button
              type="button"
              className="botao-relatorio-dashboard"
              onClick={() => {
                // Implementaremos na etapa do PDF.
              }}
            >
              Gerar relatório
            </button>
          </div>
        </section>

        {/* CARDS */}
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

        {/* GRÁFICO DE PIZZA */}
        <section className="area-grafico">
          <div className="cabecalho-grafico">
            <h2>Distribuição dos chamados</h2>

            <p>
              {mesFiltrado
                ? `Distribuição dos chamados em ${
                    NOMES_MESES[Number(mesFiltrado) - 1]
                  }/${anoFiltrado}.`
                : `Distribuição dos chamados em ${anoFiltrado}.`}
            </p>
          </div>

          <GraficoPizza
            chamadosMaquina={indicadores.chamadosMaquina}
            chamadosPredial={indicadores.chamadosPredial}
          />
        </section>

        {/* GRÁFICOS MENSAIS */}
        <section className="area-evolucao-mensal">
          <div className="cabecalho-evolucao">
            <div>
              <h2>Evolução mensal</h2>

              <p>
                Acompanhe a quantidade de chamados ao longo de {anoFiltrado}.
              </p>
            </div>
          </div>

          <GraficosMensais dadosMensais={indicadoresMensais} />
        </section>

        {/* TABELA DE MECÂNICOS */}
        <section className="area-mecanicos">
          <div className="cabecalho-mecanicos">
            <div>
              <h2>Chamados por mecânico</h2>

              <p>
                Quantidade de chamados realizados por cada mecânico no período
                selecionado.
              </p>
            </div>
          </div>

          {indicadoresMecanicos.length === 0 ? (
            <div className="tabela-sem-dados">
              <p>Nenhum chamado encontrado para o período selecionado.</p>
            </div>
          ) : (
            <div className="tabela-mecanicos-container">
              <table className="tabela-mecanicos">
                <thead>
                  <tr>
                    <th>Mecânico</th>
                    <th>Máquina</th>
                    <th>Predial</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {indicadoresMecanicos.map((mecanico) => (
                    <tr key={mecanico.nome}>
                      <td>{mecanico.nome}</td>

                      <td>{mecanico.chamadosMaquina}</td>

                      <td>{mecanico.chamadosPredial}</td>

                      <td>
                        <strong>{mecanico.totalChamados}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default Dashboard;
