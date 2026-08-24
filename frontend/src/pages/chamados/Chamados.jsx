import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import DetalhesChamadoModal from "../../components/detalhesChamadoModal/DetalhesChmadoModal";
import FiltrosChamados from "../../components/filtrosChamados/FiltrosChamados";

import { buscarChamados } from "../../service/ChamadoService";
import { buscarIndicadores } from "../../service/IndicadoresService";

import "./Chamados.css";

function Chamados() {
  const navegar = useNavigate();

  const [chamados, definirChamados] = useState([]);
  const [indicadores, definirIndicadores] = useState(null);

  const [chamadoSelecionado, definirChamadoSelecionado] = useState(null);

  const [carregamentoInicial, definirCarregamentoInicial] = useState(true);

  const [carregando, definirCarregando] = useState(false);
  const [erro, definirErro] = useState("");

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarDadosIniciais() {
      try {
        const [dadosChamados, dadosIndicadores] = await Promise.all([
          buscarChamados(),
          buscarIndicadores(),
        ]);

        if (!componenteAtivo) {
          return;
        }

        definirChamados(dadosChamados);
        definirIndicadores(dadosIndicadores);
      } catch (erroRequisicao) {
        if (!componenteAtivo) {
          return;
        }

        definirChamados([]);
        definirIndicadores(null);

        definirErro(
          erroRequisicao.message || "Não foi possível carregar os registros.",
        );
      } finally {
        if (componenteAtivo) {
          definirCarregamentoInicial(false);
        }
      }
    }

    carregarDadosIniciais();

    return () => {
      componenteAtivo = false;
    };
  }, []);

  async function aplicarFiltros(novosFiltros) {
    try {
      definirCarregando(true);
      definirErro("");

      const [dadosChamados, dadosIndicadores] = await Promise.all([
        buscarChamados(novosFiltros),
        buscarIndicadores(novosFiltros),
      ]);

      definirChamados(dadosChamados);
      definirIndicadores(dadosIndicadores);
    } catch (erroRequisicao) {
      definirChamados([]);
      definirIndicadores(null);

      definirErro(
        erroRequisicao.message || "Não foi possível aplicar os filtros.",
      );
    } finally {
      definirCarregando(false);
    }
  }

  function abrirDetalhes(chamado) {
    definirChamadoSelecionado(chamado);
  }

  function fecharDetalhes() {
    definirChamadoSelecionado(null);
  }

  function formatarData(data) {
    if (!data) {
      return "Não informada";
    }

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
  }

  function identificarMaquinaOuLocal(chamado) {
    if (chamado.tipo === "MAQUINA") {
      return chamado.maquina || "Máquina não informada";
    }

    return "Manutenção predial";
  }

  if (carregamentoInicial) {
    return (
      <main className="pagina-chamados carregamento-chamados">
        <p>Carregando chamados...</p>
      </main>
    );
  }

  return (
    <main className="pagina-chamados">
      <header className="cabecalho-pagina-chamados">
        <div>
          <h1>Registros de Chamados</h1>

          <p>Consulte os serviços de manutenção registrados.</p>
        </div>

        <div className="acoes-cabecalho-chamados">
          <button
            type="button"
            className="botao-novo-registro"
            onClick={() => navegar("/novo-registro")}
          >
            Novo Registro
          </button>

          <button
            type="button"
            className="botao-voltar-dashboard"
            onClick={() => navegar("/dashboard")}
          >
            Voltar
          </button>
        </div>
      </header>

      {erro && (
        <p className="mensagem-erro-chamados" role="alert">
          {erro}
        </p>
      )}

      {indicadores && (
        <section className="grade-indicadores-chamados">
          <article className="cartao-indicador-chamados cartao-total-chamados">
            <span>Total de chamados</span>

            <strong>{indicadores.totalChamados}</strong>
          </article>

          <article className="cartao-indicador-chamados cartao-maquina-chamados">
            <span>Chamados de máquina</span>

            <strong>{indicadores.chamadosMaquina}</strong>
          </article>

          <article className="cartao-indicador-chamados cartao-predial-chamados">
            <span>Chamados prediais</span>

            <strong>{indicadores.chamadosPredial}</strong>
          </article>
        </section>
      )}

      <FiltrosChamados
        aoAplicarFiltros={aplicarFiltros}
        carregando={carregando}
      />

      {carregando && (
        <p className="mensagem-atualizando-chamados" role="status">
          Atualizando registros...
        </p>
      )}

      {!erro && !carregando && chamados.length === 0 && (
        <section className="lista-vazia-chamados">
          <h2>Nenhum chamado encontrado</h2>

          <p>Não existem registros que correspondam aos filtros informados.</p>
        </section>
      )}

      {!erro && chamados.length > 0 && (
        <section className="area-lista-chamados">
          <header className="cabecalho-lista-chamados">
            <div>
              <h2>Chamados encontrados</h2>

              <p>Clique em um registro para visualizar todos os dados.</p>
            </div>

            <span>{chamados.length} registro(s)</span>
          </header>

          <div className="lista-chamados">
            {chamados.map((chamado) => (
              <article
                key={chamado.id}
                className="item-chamado"
                tabIndex={0}
                role="button"
                aria-label={`Visualizar detalhes do chamado ${chamado.id}`}
                onClick={() => abrirDetalhes(chamado)}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    abrirDetalhes(chamado);
                  }
                }}
              >
                <div className="topo-item-chamado">
                  <div className="identificacao-chamado">
                    <span
                      className={
                        chamado.tipo === "MAQUINA"
                          ? "tipo-chamado tipo-maquina"
                          : "tipo-chamado tipo-predial"
                      }
                    >
                      {chamado.tipo === "MAQUINA" ? "Máquina" : "Predial"}
                    </span>

                    <strong>Chamado #{chamado.id}</strong>
                  </div>

                  <span className="acao-detalhes">Ver detalhes ›</span>
                </div>

                <div className="resumo-chamado">
                  <div>
                    <span>
                      {chamado.tipo === "MAQUINA"
                        ? "Máquina"
                        : "Tipo de manutenção"}
                    </span>

                    <strong>{identificarMaquinaOuLocal(chamado)}</strong>
                  </div>

                  {chamado.tipo === "MAQUINA" && (
                    <div>
                      <span>NP</span>

                      <strong>{chamado.np || "Sem NP"}</strong>
                    </div>
                  )}

                  <div>
                    <span>Setor</span>

                    <strong>{chamado.setor || "Não informado"}</strong>
                  </div>

                  <div>
                    <span>Mecânico</span>

                    <strong>{chamado.mecanico || "Não informado"}</strong>
                  </div>

                  <div>
                    <span>Data</span>

                    <strong>{formatarData(chamado.data)}</strong>
                  </div>
                </div>

                <div className="problema-chamado">
                  <span>Problema encontrado</span>

                  <p>{chamado.defeito || "Problema não informado."}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {chamadoSelecionado && (
        <DetalhesChamadoModal
          chamado={chamadoSelecionado}
          aoFechar={fecharDetalhes}
        />
      )}
    </main>
  );
}

export default Chamados;
