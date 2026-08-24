import { useEffect, useState } from "react";

import { buscarMecanicos } from "../../service/MecanicoService";
import { buscarSetores } from "../../service/SetorService";

import "./FiltrosChamados.css";

const FILTROS_INICIAIS = {
  tipo: "",
  setorId: "",
  np: "",
  mecanicoMatricula: "",
  dataInicio: "",
  dataFim: "",
};

function FiltrosChamados({ aoAplicarFiltros, carregando }) {
  const [filtros, definirFiltros] = useState(FILTROS_INICIAIS);

  const [setores, definirSetores] = useState([]);
  const [mecanicos, definirMecanicos] = useState([]);
  const [erroListas, definirErroListas] = useState("");

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        definirErroListas("");

        const [listaSetores, listaMecanicos] = await Promise.all([
          buscarSetores(),
          buscarMecanicos(),
        ]);

        definirSetores(listaSetores);
        definirMecanicos(listaMecanicos);
      } catch (erroRequisicao) {
        definirErroListas(erroRequisicao.message);
      }
    }

    carregarOpcoes();
  }, []);

  function alterarFiltro(evento) {
    const { name, value } = evento.target;

    definirFiltros((filtrosAtuais) => ({
      ...filtrosAtuais,
      [name]: value,
    }));
  }

  function enviarFiltros(evento) {
    evento.preventDefault();

    if (
      filtros.dataInicio &&
      filtros.dataFim &&
      filtros.dataInicio > filtros.dataFim
    ) {
      definirErroListas("A data inicial não pode ser posterior à data final.");

      return;
    }

    definirErroListas("");
    aoAplicarFiltros(filtros);
  }

  function limparFiltros() {
    definirFiltros(FILTROS_INICIAIS);
    definirErroListas("");
    aoAplicarFiltros(FILTROS_INICIAIS);
  }

  const possuiFiltros = Object.values(filtros).some((valor) => valor !== "");

  return (
    <section className="area-filtros-chamados">
      <header className="cabecalho-filtros-chamados">
        <div>
          <h2>Filtros</h2>

          <p>Combine os campos para encontrar registros específicos.</p>
        </div>

        {possuiFiltros && (
          <span className="indicador-filtros-ativos">Filtros preenchidos</span>
        )}
      </header>

      <form className="formulario-filtros-chamados" onSubmit={enviarFiltros}>
        <div className="campo-filtro">
          <label htmlFor="filtro-tipo">Tipo</label>

          <select
            id="filtro-tipo"
            name="tipo"
            value={filtros.tipo}
            onChange={alterarFiltro}
            disabled={carregando}
          >
            <option value="">Todos os tipos</option>
            <option value="MAQUINA">Máquina</option>
            <option value="PREDIAL">Predial</option>
          </select>
        </div>

        <div className="campo-filtro">
          <label htmlFor="filtro-setor">Setor</label>

          <select
            id="filtro-setor"
            name="setorId"
            value={filtros.setorId}
            onChange={alterarFiltro}
            disabled={carregando}
          >
            <option value="">Todos os setores</option>

            {setores.map((setor) => (
              <option key={setor.id} value={setor.id}>
                {setor.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="campo-filtro">
          <label htmlFor="filtro-mecanico">Mecânico</label>

          <select
            id="filtro-mecanico"
            name="mecanicoMatricula"
            value={filtros.mecanicoMatricula}
            onChange={alterarFiltro}
            disabled={carregando}
          >
            <option value="">Todos os mecânicos</option>

            {mecanicos.map((mecanico) => (
              <option key={mecanico.id} value={mecanico.matricula}>
                {mecanico.matricula} - {mecanico.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="campo-filtro">
          <label htmlFor="filtro-np">NP da máquina</label>

          <input
            id="filtro-np"
            name="np"
            type="number"
            min="1"
            value={filtros.np}
            onChange={alterarFiltro}
            placeholder="Todos os NPs"
            disabled={carregando}
          />
        </div>

        <div className="campo-filtro">
          <label htmlFor="filtro-data-inicio">Data inicial</label>

          <input
            id="filtro-data-inicio"
            name="dataInicio"
            type="date"
            value={filtros.dataInicio}
            onChange={alterarFiltro}
            disabled={carregando}
          />
        </div>

        <div className="campo-filtro">
          <label htmlFor="filtro-data-fim">Data final</label>

          <input
            id="filtro-data-fim"
            name="dataFim"
            type="date"
            value={filtros.dataFim}
            onChange={alterarFiltro}
            disabled={carregando}
          />
        </div>

        <div className="acoes-filtros-chamados">
          <button
            type="button"
            className="botao-limpar-filtros"
            onClick={limparFiltros}
            disabled={carregando || !possuiFiltros}
          >
            Limpar
          </button>

          <button
            type="submit"
            className="botao-aplicar-filtros"
            disabled={carregando}
          >
            {carregando ? "Filtrando..." : "Aplicar filtros"}
          </button>
        </div>
      </form>

      {erroListas && (
        <p className="mensagem-erro-filtros" role="alert">
          {erroListas}
        </p>
      )}
    </section>
  );
}

export default FiltrosChamados;
