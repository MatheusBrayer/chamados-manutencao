import { URL_API } from "../config/api";

function montarParametros(filtros = {}) {
  const parametros = new URLSearchParams();

  if (filtros.tipo) {
    parametros.append("tipo", filtros.tipo);
  }

  if (filtros.setorId) {
    parametros.append("setorId", filtros.setorId);
  }

  if (filtros.np) {
    parametros.append("np", filtros.np);
  }

  if (filtros.mecanicoMatricula) {
    parametros.append("mecanicoMatricula", filtros.mecanicoMatricula);
  }

  if (filtros.dataInicio) {
    parametros.append("dataInicio", filtros.dataInicio);
  }

  if (filtros.dataFim) {
    parametros.append("dataFim", filtros.dataFim);
  }

  return parametros.toString();
}

export async function buscarIndicadores(filtros = {}) {
  const consulta = montarParametros(filtros);

  const url = consulta
    ? `${URL_API}/indicadores?${consulta}`
    : `${URL_API}/indicadores`;

  const resposta = await fetch(url);

  if (!resposta.ok) {
    const mensagemErro = await resposta.text();

    throw new Error(
      mensagemErro || "Não foi possível carregar os indicadores.",
    );
  }

  return resposta.json();
}

export async function buscarIndicadoresMensais(ano) {
  const resposta = await fetch(`${URL_API}/indicadores/mensais?ano=${ano}`);

  if (!resposta.ok) {
    const mensagemErro = await resposta.text();

    throw new Error(
      mensagemErro || "Não foi possível carregar os indicadores mensais.",
    );
  }

  return resposta.json();
}
