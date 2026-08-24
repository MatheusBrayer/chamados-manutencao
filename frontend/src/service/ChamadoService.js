const URL_API = "http://localhost:8080/api";

export async function cadastrarChamado(dadosChamado) {
  const resposta = await fetch(`${URL_API}/chamados`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dadosChamado),
  });

  if (!resposta.ok) {
    const mensagemErro = await resposta.text();

    throw new Error(mensagemErro || "Não foi possível cadastrar o registro.");
  }

  return resposta.json();
}

export async function buscarChamados(filtros = {}) {
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

  const consulta = parametros.toString();

  const url = consulta
    ? `${URL_API}/chamados?${consulta}`
    : `${URL_API}/chamados`;

  const resposta = await fetch(url);

  if (!resposta.ok) {
    const mensagemErro = await resposta.text();

    throw new Error(mensagemErro || "Não foi possível carregar os chamados.");
  }

  return resposta.json();
}
