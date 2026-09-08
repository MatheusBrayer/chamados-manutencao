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

async function verificarResposta(resposta, mensagemPadrao) {
  if (!resposta.ok) {
    const mensagemErro = await resposta.text();

    throw new Error(mensagemErro || mensagemPadrao);
  }

  return resposta.json();
}

export async function buscarIndicadores(filtros = {}) {
  const consulta = montarParametros(filtros);

  const url = consulta
    ? `${URL_API}/indicadores?${consulta}`
    : `${URL_API}/indicadores`;

  const resposta = await fetch(url);

  return verificarResposta(
    resposta,
    "Não foi possível carregar os indicadores.",
  );
}

export async function buscarIndicadoresMensais(ano) {
  const resposta = await fetch(`${URL_API}/indicadores/mensais?ano=${ano}`);

  return verificarResposta(
    resposta,
    "Não foi possível carregar os indicadores mensais.",
  );
}

export async function buscarIndicadoresMecanicos(filtros = {}) {
  const consulta = montarParametros(filtros);

  const url = consulta
    ? `${URL_API}/indicadores/mecanicos?${consulta}`
    : `${URL_API}/indicadores/mecanicos`;

  const resposta = await fetch(url);

  return verificarResposta(
    resposta,
    "Não foi possível carregar os indicadores dos mecânicos.",
  );
}
