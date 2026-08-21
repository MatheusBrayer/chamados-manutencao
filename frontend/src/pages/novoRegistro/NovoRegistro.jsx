import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { cadastrarChamado } from "../../service/ChamadoService";
import { buscarMaquinaPorNp } from "../../service/MaquinaService";
import { buscarMecanicos } from "../../service/MecanicoService";
import { buscarSetores } from "../../service/SetorService";

import "./NovoRegistro.css";

function NovoRegistro() {
  const navegar = useNavigate();

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const [tipo, definirTipo] = useState("MAQUINA");
  const [np, definirNp] = useState("");
  const [nomeMaquina, definirNomeMaquina] = useState("");
  const [setorId, definirSetorId] = useState("");

  const [mecanicoMatricula, definirMecanicoMatricula] = useState(
    usuarioLogado?.matricula || "",
  );

  const [defeito, definirDefeito] = useState("");
  const [solucao, definirSolucao] = useState("");

  const [data, definirData] = useState(new Date().toISOString().split("T")[0]);

  const [setores, definirSetores] = useState([]);
  const [mecanicos, definirMecanicos] = useState([]);

  const [maquinaEncontrada, definirMaquinaEncontrada] = useState(false);

  const [consultandoMaquina, definirConsultandoMaquina] = useState(false);

  const [mensagemMaquina, definirMensagemMaquina] = useState("");

  const [carregandoDados, definirCarregandoDados] = useState(true);

  const [salvando, definirSalvando] = useState(false);
  const [erro, definirErro] = useState("");
  const [sucesso, definirSucesso] = useState("");

  useEffect(() => {
    async function carregarDadosFormulario() {
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

    carregarDadosFormulario();
  }, []);

  function alterarTipo(novoTipo) {
    definirTipo(novoTipo);
    definirErro("");
    definirSucesso("");
    definirMensagemMaquina("");
    definirMaquinaEncontrada(false);

    if (novoTipo === "PREDIAL") {
      definirNp("");
      definirNomeMaquina("");
    }
  }

  function alterarNp(evento) {
    definirNp(evento.target.value);
    definirNomeMaquina("");
    definirMaquinaEncontrada(false);
    definirMensagemMaquina("");
    definirErro("");
    definirSucesso("");
  }

  async function consultarMaquinaPorNp() {
    if (!np) {
      definirNomeMaquina("");
      definirMaquinaEncontrada(false);
      definirMensagemMaquina("Máquina sem NP. Informe o nome da máquina.");

      return;
    }

    try {
      definirConsultandoMaquina(true);
      definirErro("");
      definirSucesso("");
      definirMensagemMaquina("");

      const maquina = await buscarMaquinaPorNp(Number(np));

      if (maquina) {
        definirNomeMaquina(maquina.nome);
        definirMaquinaEncontrada(true);
        definirMensagemMaquina("Máquina encontrada no cadastro.");
      } else {
        definirNomeMaquina("");
        definirMaquinaEncontrada(false);
        definirMensagemMaquina(
          "Máquina não cadastrada. Informe o nome para cadastrá-la.",
        );
      }
    } catch (erroRequisicao) {
      definirNomeMaquina("");
      definirMaquinaEncontrada(false);
      definirMensagemMaquina("");
      definirErro(erroRequisicao.message);
    } finally {
      definirConsultandoMaquina(false);
    }
  }

  function limparFormulario() {
    definirTipo("MAQUINA");
    definirNp("");
    definirNomeMaquina("");
    definirSetorId("");

    definirMecanicoMatricula(usuarioLogado?.matricula || "");

    definirDefeito("");
    definirSolucao("");

    definirData(new Date().toISOString().split("T")[0]);

    definirMaquinaEncontrada(false);
    definirMensagemMaquina("");
    definirErro("");
  }

  async function enviarFormulario(evento) {
    evento.preventDefault();

    try {
      definirSalvando(true);
      definirErro("");
      definirSucesso("");

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

      await cadastrarChamado(dadosChamado);

      limparFormulario();

      definirSucesso("Registro cadastrado com sucesso!");
    } catch (erroRequisicao) {
      definirErro(erroRequisicao.message);
    } finally {
      definirSalvando(false);
    }
  }

  const formularioBloqueado = salvando || carregandoDados || consultandoMaquina;

  return (
    <main className="pagina-novo-registro">
      <section className="cartao-novo-registro">
        <header className="cabecalho-novo-registro">
          <div>
            <h1>Novo Registro</h1>

            <p>Informe os dados da manutenção realizada.</p>
          </div>

          <button
            type="button"
            className="botao-voltar"
            onClick={() => navegar("/dashboard")}
          >
            Voltar
          </button>
        </header>

        {carregandoDados ? (
          <p className="mensagem-carregamento">
            Carregando dados do formulário...
          </p>
        ) : (
          <form
            className="formulario-novo-registro"
            onSubmit={enviarFormulario}
          >
            <fieldset className="grupo-tipo">
              <legend>Tipo de registro</legend>

              <label className="opcao-tipo">
                <input
                  type="radio"
                  name="tipo"
                  value="MAQUINA"
                  checked={tipo === "MAQUINA"}
                  onChange={() => alterarTipo("MAQUINA")}
                  disabled={salvando}
                />

                <span>Máquina</span>
              </label>

              <label className="opcao-tipo">
                <input
                  type="radio"
                  name="tipo"
                  value="PREDIAL"
                  checked={tipo === "PREDIAL"}
                  onChange={() => alterarTipo("PREDIAL")}
                  disabled={salvando}
                />

                <span>Predial</span>
              </label>
            </fieldset>

            {tipo === "MAQUINA" && (
              <section className="secao-maquina">
                <div className="titulo-subsecao">
                  <h2>Identificação da máquina</h2>

                  <p>O NP é opcional para máquinas antigas.</p>
                </div>

                <div className="grade-formulario">
                  <div className="campo-registro">
                    <label htmlFor="np">NP, se houver</label>

                    <input
                      id="np"
                      name="np"
                      type="number"
                      min="1"
                      value={np}
                      onChange={alterarNp}
                      onBlur={consultarMaquinaPorNp}
                      placeholder="Digite o NP"
                      disabled={salvando || consultandoMaquina}
                    />

                    {consultandoMaquina && (
                      <small className="mensagem-consulta-maquina">
                        Consultando máquina...
                      </small>
                    )}

                    {!consultandoMaquina && mensagemMaquina && (
                      <small
                        className={
                          maquinaEncontrada
                            ? "mensagem-maquina-encontrada"
                            : "mensagem-maquina-nao-encontrada"
                        }
                      >
                        {mensagemMaquina}
                      </small>
                    )}
                  </div>

                  <div className="campo-registro">
                    <label htmlFor="nome-maquina">Nome da máquina</label>

                    <input
                      id="nome-maquina"
                      name="nomeMaquina"
                      type="text"
                      value={nomeMaquina}
                      onChange={(evento) =>
                        definirNomeMaquina(evento.target.value)
                      }
                      placeholder={
                        maquinaEncontrada
                          ? "Máquina cadastrada"
                          : "Digite o nome da máquina"
                      }
                      readOnly={maquinaEncontrada}
                      disabled={salvando || consultandoMaquina}
                      required
                    />
                  </div>
                </div>
              </section>
            )}

            <section className="secao-dados-registro">
              <div className="titulo-subsecao">
                <h2>Dados do registro</h2>

                <p>Informe o local, o responsável e o serviço realizado.</p>
              </div>

              <div className="grade-formulario">
                <div className="campo-registro">
                  <label htmlFor="setor">Setor</label>

                  <select
                    id="setor"
                    name="setor"
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

                <div className="campo-registro">
                  <label htmlFor="mecanico">Mecânico</label>

                  <select
                    id="mecanico"
                    name="mecanico"
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
              <div className="campo-registro">
                <label htmlFor="defeito">Defeito ou problema encontrado</label>

                <textarea
                  id="defeito"
                  name="defeito"
                  rows="4"
                  maxLength="255"
                  value={defeito}
                  onChange={(evento) => definirDefeito(evento.target.value)}
                  placeholder="Descreva o problema encontrado"
                  disabled={formularioBloqueado}
                  required
                />

                <small className="contador-caracteres">
                  {defeito.length}/255
                </small>
              </div>

              <div className="campo-registro">
                <label htmlFor="solucao">Solução realizada</label>

                <textarea
                  id="solucao"
                  name="solucao"
                  rows="4"
                  maxLength="255"
                  value={solucao}
                  onChange={(evento) => definirSolucao(evento.target.value)}
                  placeholder="Descreva o serviço realizado"
                  disabled={formularioBloqueado}
                  required
                />

                <small className="contador-caracteres">
                  {solucao.length}/255
                </small>
              </div>

              <div className="campo-registro campo-data">
                <label htmlFor="data">Data do serviço</label>

                <input
                  id="data"
                  name="data"
                  type="date"
                  value={data}
                  onChange={(evento) => definirData(evento.target.value)}
                  disabled={formularioBloqueado}
                  required
                />
              </div>
            </section>

            {erro && (
              <p
                className="mensagem-registro mensagem-erro-registro"
                role="alert"
              >
                {erro}
              </p>
            )}

            {sucesso && (
              <p
                className="mensagem-registro mensagem-sucesso-registro"
                role="status"
              >
                {sucesso}
              </p>
            )}

            <div className="acoes-formulario">
              <button
                type="button"
                className="botao-cancelar"
                onClick={() => navegar("/dashboard")}
                disabled={salvando}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="botao-salvar"
                disabled={formularioBloqueado}
              >
                {salvando ? "Salvando..." : "Salvar Registro"}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

export default NovoRegistro;
