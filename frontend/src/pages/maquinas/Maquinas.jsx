import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { buscarMaquinas } from "../../service/MaquinaService";

import "./Maquinas.css";

function Maquinas() {
  const navegar = useNavigate();

  const [maquinas, definirMaquinas] = useState([]);
  const [termoPesquisa, definirTermoPesquisa] = useState("");

  const [carregando, definirCarregando] = useState(true);

  const [erro, definirErro] = useState("");

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarMaquinas() {
      try {
        definirErro("");

        const dados = await buscarMaquinas();

        if (!componenteAtivo) {
          return;
        }

        definirMaquinas(dados);
      } catch (erroRequisicao) {
        if (!componenteAtivo) {
          return;
        }

        definirErro(
          erroRequisicao.message || "Não foi possível carregar as máquinas.",
        );
      } finally {
        if (componenteAtivo) {
          definirCarregando(false);
        }
      }
    }

    carregarMaquinas();

    return () => {
      componenteAtivo = false;
    };
  }, []);

  const maquinasFiltradas = useMemo(() => {
    const termoNormalizado = termoPesquisa.trim().toLowerCase();

    if (!termoNormalizado) {
      return maquinas;
    }

    return maquinas.filter((maquina) => {
      const np = maquina.np ? String(maquina.np) : "sem np";

      const nome = maquina.nome?.toLowerCase() || "";

      const setor = maquina.setor?.toLowerCase() || "setor não informado";

      return (
        np.includes(termoNormalizado) ||
        nome.includes(termoNormalizado) ||
        setor.includes(termoNormalizado)
      );
    });
  }, [maquinas, termoPesquisa]);

  function limparPesquisa() {
    definirTermoPesquisa("");
  }

  if (carregando) {
    return (
      <main className="pagina-maquinas carregamento-maquinas">
        <p>Carregando máquinas...</p>
      </main>
    );
  }

  return (
    <main className="pagina-maquinas">
      <header className="cabecalho-pagina-maquinas">
        <div>
          <h1>Máquinas cadastradas</h1>

          <p>Consulte os equipamentos e seus setores atuais.</p>
        </div>

        <button
          type="button"
          className="botao-voltar-maquinas"
          onClick={() => navegar("/dashboard")}
        >
          Voltar
        </button>
      </header>

      {erro && (
        <p className="mensagem-erro-maquinas" role="alert">
          {erro}
        </p>
      )}

      {!erro && (
        <section className="area-lista-maquinas">
          <header className="cabecalho-lista-maquinas">
            <div>
              <h2>Lista de equipamentos</h2>

              <p>Pesquise por NP, nome da máquina ou setor.</p>
            </div>

            <span>{maquinasFiltradas.length} encontrada(s)</span>
          </header>

          <div className="area-pesquisa-maquinas">
            <div className="campo-pesquisa-maquinas">
              <label htmlFor="pesquisa-maquina">Buscar máquina</label>

              <input
                id="pesquisa-maquina"
                type="search"
                value={termoPesquisa}
                onChange={(evento) => definirTermoPesquisa(evento.target.value)}
                placeholder="Digite o NP, nome ou setor"
              />
            </div>

            {termoPesquisa && (
              <button
                type="button"
                className="botao-limpar-pesquisa"
                onClick={limparPesquisa}
              >
                Limpar
              </button>
            )}
          </div>

          {maquinasFiltradas.length === 0 ? (
            <div className="lista-vazia-maquinas">
              <h3>Nenhuma máquina encontrada</h3>

              <p>Não existem máquinas correspondentes à pesquisa informada.</p>
            </div>
          ) : (
            <div className="tabela-maquinas">
              <div className="linha-cabecalho-maquinas">
                <span>NP</span>
                <span>Máquina</span>
                <span>Setor atual</span>
              </div>

              <div className="corpo-tabela-maquinas">
                {maquinasFiltradas.map((maquina) => (
                  <article key={maquina.id} className="linha-maquina">
                    <div className="dado-maquina">
                      <span className="rotulo-mobile-maquina">NP</span>

                      {maquina.np ? (
                        <strong>{maquina.np}</strong>
                      ) : (
                        <span className="etiqueta-sem-np">Sem NP</span>
                      )}
                    </div>

                    <div className="dado-maquina">
                      <span className="rotulo-mobile-maquina">Máquina</span>

                      <span>{maquina.nome || "Nome não informado"}</span>
                    </div>

                    <div className="dado-maquina">
                      <span className="rotulo-mobile-maquina">Setor atual</span>

                      <span
                        className={
                          maquina.setor
                            ? "etiqueta-setor-maquina"
                            : "etiqueta-setor-nao-informado"
                        }
                      >
                        {maquina.setor || "Setor não informado"}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default Maquinas;
