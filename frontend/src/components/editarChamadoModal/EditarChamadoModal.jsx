import { useEffect, useState } from "react";

import { editarChamado } from "../../service/ChamadoService";
import { buscarMaquinaPorNp } from "../../service/MaquinaService";
import { buscarMecanicos } from "../../service/MecanicoService";
import { buscarSetores } from "../../service/SetorService";

import "./EditarChamadoModal.css";

function EditarChamadoModal({ chamado, aoFechar, aoConcluir }) {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const [tipo, definirTipo] = useState(chamado.tipo);
  const [np, definirNp] = useState(chamado.np || "");
  const [nomeMaquina, definirNomeMaquina] = useState(chamado.maquina || "");
  const [setorId, definirSetorId] = useState(chamado.setorId || "");
  const [mecanicoMatricula, definirMecanicoMatricula] = useState(
    chamado.mecanicoMatricula || "",
  );
  const [defeito, definirDefeito] = useState(chamado.defeito || "");
  const [solucao, definirSolucao] = useState(chamado.solucao || "");
  const [data, definirData] = useState(chamado.data || "");

  const [setores, definirSetores] = useState([]);
  const [mecanicos, definirMecanicos] = useState([]);

  const [maquinaEncontrada, definirMaquinaEncontrada] = useState(
    Boolean(chamado.np),
  );

  const [consultandoMaquina, definirConsultandoMaquina] = useState(false);

  const [carregandoDados, definirCarregandoDados] = useState(true);

  const [salvando, definirSalvando] = useState(false);
  const [erro, definirErro] = useState("");

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        definirCarregandoDados(true);
        definirErro("");

        const [listaSetores, listaMecanicos] = await Promise.all([
          buscarSetores(),
          buscarMecanicos(),
        ]);

        definirSetores(listaSetores);
        definirMecanicos(listaMecanicos);
      } catch (erroRequisicao) {
        definirErro(erroRequisicao.message);
      } finally {
        definirCarregandoDados(false);
      }
    }

    carregarOpcoes();
  }, []);

  useEffect(() => {
    function fecharComEscape(evento) {
      if (evento.key === "Escape" && !salvando) {
        aoFechar();
      }
    }

    document.addEventListener("keydown", fecharComEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", fecharComEscape);

      document.body.style.overflow = "";
    };
  }, [aoFechar, salvando]);

  function alterarTipo(novoTipo) {
    definirTipo(novoTipo);
    definirErro("");

    if (novoTipo === "PREDIAL") {
      definirNp("");
      definirNomeMaquina("");
      definirMaquinaEncontrada(false);
    }
  }

  function alterarNp(evento) {
    definirNp(evento.target.value);
    definirNomeMaquina("");
    definirMaquinaEncontrada(false);
  }

  async function consultarMaquina() {
    if (!np) {
      definirMaquinaEncontrada(false);
      return;
    }

    try {
      definirConsultandoMaquina(true);
      definirErro("");

      const maquina = await buscarMaquinaPorNp(Number(np));

      if (maquina) {
        definirNomeMaquina(maquina.nome);
        definirMaquinaEncontrada(true);
      } else {
        definirNomeMaquina("");
        definirMaquinaEncontrada(false);
      }
    } catch (erroRequisicao) {
      definirErro(erroRequisicao.message);
    } finally {
      definirConsultandoMaquina(false);
    }
  }

  async function enviarEdicao(evento) {
    evento.preventDefault();

    try {
      definirSalvando(true);
      definirErro("");

      if (tipo === "MAQUINA" && !nomeMaquina.trim()) {
        throw new Error("Informe o nome da máquina.");
      }

      const dadosChamado = {
        tipo,
        setorId: Number(setorId),
        mecanicoMatricula: Number(mecanicoMatricula),
        defeito: defeito.trim(),
        solucao: solucao.trim(),
        data,
      };

      if (tipo === "MAQUINA") {
        dadosChamado.np = np ? Number(np) : null;
        dadosChamado.nome = nomeMaquina.trim();
      }

      await editarChamado(chamado.id, usuarioLogado.matricula, dadosChamado);

      await aoConcluir();
    } catch (erroRequisicao) {
      definirErro(
        erroRequisicao.message || "Não foi possível editar o chamado.",
      );
    } finally {
      definirSalvando(false);
    }
  }

  function clicarNoFundo(evento) {
    if (evento.target === evento.currentTarget && !salvando) {
      aoFechar();
    }
  }

  const formularioBloqueado = salvando || carregandoDados || consultandoMaquina;

  return (
    <div
      className="fundo-modal-edicao"
      onMouseDown={clicarNoFundo}
      role="presentation"
    >
      <article
        className="modal-edicao-chamado"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-edicao-chamado"
      >
        <header className="cabecalho-edicao-chamado">
          <div>
            <h2 id="titulo-edicao-chamado">Editar chamado #{chamado.id}</h2>

            <p>Altere os dados necessários e salve.</p>
          </div>

          <button
            type="button"
            className="botao-fechar-edicao"
            onClick={aoFechar}
            disabled={salvando}
            aria-label="Fechar edição"
          >
            ×
          </button>
        </header>

        {carregandoDados ? (
          <p className="mensagem-carregamento-edicao">Carregando dados...</p>
        ) : (
          <form className="formulario-edicao-chamado" onSubmit={enviarEdicao}>
            <fieldset className="grupo-tipo-edicao">
              <legend>Tipo do chamado</legend>

              <label>
                <input
                  type="radio"
                  name="tipo"
                  checked={tipo === "MAQUINA"}
                  onChange={() => alterarTipo("MAQUINA")}
                  disabled={salvando}
                />
                Máquina
              </label>

              <label>
                <input
                  type="radio"
                  name="tipo"
                  checked={tipo === "PREDIAL"}
                  onChange={() => alterarTipo("PREDIAL")}
                  disabled={salvando}
                />
                Predial
              </label>
            </fieldset>

            {tipo === "MAQUINA" && (
              <div className="grade-edicao">
                <div className="campo-edicao">
                  <label htmlFor="edicao-np">NP, se houver</label>

                  <input
                    id="edicao-np"
                    type="number"
                    min="1"
                    value={np}
                    onChange={alterarNp}
                    onBlur={consultarMaquina}
                    disabled={formularioBloqueado}
                  />
                </div>

                <div className="campo-edicao">
                  <label htmlFor="edicao-maquina">Máquina</label>

                  <input
                    id="edicao-maquina"
                    type="text"
                    value={nomeMaquina}
                    onChange={(evento) =>
                      definirNomeMaquina(evento.target.value)
                    }
                    readOnly={maquinaEncontrada}
                    disabled={formularioBloqueado}
                    required
                  />
                </div>
              </div>
            )}

            <div className="grade-edicao">
              <div className="campo-edicao">
                <label htmlFor="edicao-setor">Setor</label>

                <select
                  id="edicao-setor"
                  value={setorId}
                  onChange={(evento) => definirSetorId(evento.target.value)}
                  disabled={formularioBloqueado}
                  required
                >
                  <option value="">Selecione um setor</option>

                  {setores.map((setor) => (
                    <option key={setor.id} value={setor.id}>
                      {setor.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-edicao">
                <label htmlFor="edicao-mecanico">Mecânico</label>

                <select
                  id="edicao-mecanico"
                  value={mecanicoMatricula}
                  onChange={(evento) =>
                    definirMecanicoMatricula(evento.target.value)
                  }
                  disabled={formularioBloqueado}
                  required
                >
                  <option value="">Selecione um mecânico</option>

                  {mecanicos.map((mecanico) => (
                    <option key={mecanico.id} value={mecanico.matricula}>
                      {mecanico.matricula} - {mecanico.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="campo-edicao">
              <label htmlFor="edicao-defeito">
                Defeito ou problema encontrado
              </label>

              <textarea
                id="edicao-defeito"
                rows="2"
                maxLength="255"
                value={defeito}
                onChange={(evento) => definirDefeito(evento.target.value)}
                disabled={formularioBloqueado}
                required
              />
            </div>

            <div className="campo-edicao">
              <label htmlFor="edicao-solucao">Solução realizada</label>

              <textarea
                id="edicao-solucao"
                rows="2"
                maxLength="255"
                value={solucao}
                onChange={(evento) => definirSolucao(evento.target.value)}
                disabled={formularioBloqueado}
                required
              />
            </div>

            <div className="campo-edicao campo-data-edicao">
              <label htmlFor="edicao-data">Data do serviço</label>

              <input
                id="edicao-data"
                type="date"
                value={data}
                onChange={(evento) => definirData(evento.target.value)}
                disabled={formularioBloqueado}
                required
              />
            </div>

            {erro && (
              <p className="mensagem-erro-edicao" role="alert">
                {erro}
              </p>
            )}

            <footer className="acoes-edicao-chamado">
              <button
                type="button"
                className="botao-cancelar-edicao"
                onClick={aoFechar}
                disabled={salvando}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="botao-salvar-edicao"
                disabled={formularioBloqueado}
              >
                {salvando ? "Salvando..." : "Salvar alterações"}
              </button>
            </footer>
          </form>
        )}
      </article>
    </div>
  );
}

export default EditarChamadoModal;
