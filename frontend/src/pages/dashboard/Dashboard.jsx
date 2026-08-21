import { useEffect, useState } from "react";
import { buscarIndicadores } from "../../service/IndicadoresService";
import "./Dashboard.css";

function Dashboard() {
  const [indicadores, definirIndicadores] = useState(null);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState("");

  useEffect(() => {
    async function carregarIndicadores() {
      try {
        definirCarregando(true);
        definirErro("");

        const dados = await buscarIndicadores();

        definirIndicadores(dados);
      } catch (erroRequisicao) {
        definirErro(erroRequisicao.message);
      } finally {
        definirCarregando(false);
      }
    }

    carregarIndicadores();
  }, []);

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
          <p>Visão geral dos registros de manutenção</p>
        </div>

        <nav className="navegacao-dashboard">
          <button type="button">Novo Registro</button>

          <details className="menu-registros">
            <summary>Registros</summary>

            <div className="opcoes-registros">
              <button type="button">Chamados</button>
              <button type="button">Máquinas</button>
              <button type="button">Mecânicos</button>
            </div>
          </details>

          <button type="button">Sair</button>
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
          <h2>Distribuição dos chamados</h2>

          <div className="grafico-provisorio">
            O gráfico de pizza será colocado aqui.
          </div>
        </section>
      </section>
    </main>
  );
}

export default Dashboard;
