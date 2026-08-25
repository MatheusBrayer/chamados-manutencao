import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { buscarMecanicos } from "../../service/MecanicoService";

import "./Mecanicos.css";

function Mecanicos() {
  const navegar = useNavigate();

  const [mecanicos, definirMecanicos] = useState([]);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState("");

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarMecanicos() {
      try {
        definirErro("");

        const dados = await buscarMecanicos();

        if (!componenteAtivo) {
          return;
        }

        definirMecanicos(dados);
      } catch (erroRequisicao) {
        if (!componenteAtivo) {
          return;
        }

        definirErro(
          erroRequisicao.message || "Não foi possível carregar os mecânicos.",
        );
      } finally {
        if (componenteAtivo) {
          definirCarregando(false);
        }
      }
    }

    carregarMecanicos();

    return () => {
      componenteAtivo = false;
    };
  }, []);

  function formatarPerfil(perfil) {
    if (perfil === "ADMIN") {
      return "Administrador";
    }

    return "Mecânico";
  }

  if (carregando) {
    return (
      <main className="pagina-mecanicos carregamento-mecanicos">
        <p>Carregando mecânicos...</p>
      </main>
    );
  }

  return (
    <main className="pagina-mecanicos">
      <header className="cabecalho-pagina-mecanicos">
        <div>
          <h1>Mecânicos cadastrados</h1>

          <p>Consulte os profissionais cadastrados no sistema.</p>
        </div>

        <button
          type="button"
          className="botao-voltar-mecanicos"
          onClick={() => navegar("/dashboard")}
        >
          Voltar
        </button>
      </header>

      {erro && (
        <p className="mensagem-erro-mecanicos" role="alert">
          {erro}
        </p>
      )}

      {!erro && mecanicos.length === 0 && (
        <section className="lista-vazia-mecanicos">
          <h2>Nenhum mecânico cadastrado</h2>

          <p>Os profissionais cadastrados aparecerão nesta página.</p>
        </section>
      )}

      {!erro && mecanicos.length > 0 && (
        <section className="area-lista-mecanicos">
          <header className="cabecalho-lista-mecanicos">
            <div>
              <h2>Lista de profissionais</h2>

              <p>Matrículas, nomes e perfis cadastrados.</p>
            </div>

            <span>{mecanicos.length} cadastrado(s)</span>
          </header>

          <div className="tabela-mecanicos">
            <div className="linha-cabecalho-mecanicos">
              <span>Matrícula</span>
              <span>Nome</span>
              <span>Perfil</span>
            </div>

            <div className="corpo-tabela-mecanicos">
              {mecanicos.map((mecanico) => (
                <article key={mecanico.id} className="linha-mecanico">
                  <div className="dado-mecanico">
                    <span className="rotulo-mobile">Matrícula</span>

                    <strong>{mecanico.matricula}</strong>
                  </div>

                  <div className="dado-mecanico">
                    <span className="rotulo-mobile">Nome</span>

                    <span>{mecanico.nome}</span>
                  </div>

                  <div className="dado-mecanico">
                    <span className="rotulo-mobile">Perfil</span>

                    <span
                      className={
                        mecanico.perfil === "ADMIN"
                          ? "etiqueta-perfil perfil-administrador"
                          : "etiqueta-perfil perfil-mecanico"
                      }
                    >
                      {formatarPerfil(mecanico.perfil)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default Mecanicos;
