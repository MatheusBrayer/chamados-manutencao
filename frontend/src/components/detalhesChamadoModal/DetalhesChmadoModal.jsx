import { useEffect } from "react";

import "./DetalhesChamadoModal.css";

function DetalhesChamadoModal({ chamado, aoFechar }) {
  useEffect(() => {
    function fecharComEscape(evento) {
      if (evento.key === "Escape") {
        aoFechar();
      }
    }

    document.addEventListener("keydown", fecharComEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", fecharComEscape);

      document.body.style.overflow = "";
    };
  }, [aoFechar]);

  function formatarData(data) {
    if (!data) {
      return "Não informada";
    }

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
  }

  function fecharAoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget) {
      aoFechar();
    }
  }

  return (
    <div
      className="fundo-modal-chamado"
      onMouseDown={fecharAoClicarNoFundo}
      role="presentation"
    >
      <article
        className="modal-detalhes-chamado"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-chamado"
      >
        <header className="cabecalho-modal-chamado">
          <div>
            <span
              className={
                chamado.tipo === "MAQUINA"
                  ? "etiqueta-tipo etiqueta-maquina"
                  : "etiqueta-tipo etiqueta-predial"
              }
            >
              {chamado.tipo === "MAQUINA" ? "Máquina" : "Predial"}
            </span>

            <h2 id="titulo-modal-chamado">Chamado #{chamado.id}</h2>
          </div>

          <button
            type="button"
            className="botao-fechar-modal"
            onClick={aoFechar}
            aria-label="Fechar detalhes"
          >
            ×
          </button>
        </header>

        <section className="grade-dados-chamado">
          {chamado.tipo === "MAQUINA" && (
            <>
              <div className="dado-chamado">
                <span>NP</span>

                <strong>{chamado.np || "Sem NP"}</strong>
              </div>

              <div className="dado-chamado">
                <span>Máquina</span>

                <strong>{chamado.maquina || "Não informada"}</strong>
              </div>
            </>
          )}

          <div className="dado-chamado">
            <span>Setor</span>
            <strong>{chamado.setor}</strong>
          </div>

          <div className="dado-chamado">
            <span>Mecânico</span>
            <strong>{chamado.mecanico}</strong>
          </div>

          <div className="dado-chamado">
            <span>Data do serviço</span>

            <strong>{formatarData(chamado.data)}</strong>
          </div>
        </section>

        <section className="textos-chamado">
          <div>
            <h3>Defeito ou problema encontrado</h3>

            <p>{chamado.defeito}</p>
          </div>

          <div>
            <h3>Solução realizada</h3>
            <p>{chamado.solucao}</p>
          </div>
        </section>

        <footer className="rodape-modal-chamado">
          <button
            type="button"
            className="botao-concluir-modal"
            onClick={aoFechar}
          >
            Fechar
          </button>
        </footer>
      </article>
    </div>
  );
}

export default DetalhesChamadoModal;
