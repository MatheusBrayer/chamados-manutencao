import { URL_API } from "../config/api";

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

export async function buscarChamados(filtros = {}, pagina = 0, tamanho = 10) {
  const parametros = new URLSearchParams();

  parametros.append("page", String(pagina));
  parametros.append("size", String(tamanho));

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

  const resposta = await fetch(`${URL_API}/chamados?${parametros.toString()}`);

  if (!resposta.ok) {
    const mensagemErro = await resposta.text();

    throw new Error(mensagemErro || "Não foi possível carregar os chamados.");
  }

  return resposta.json();
}

export async function editarChamado(chamadoId, matriculaUsuario, dadosChamado) {
  const resposta = await fetch(`${URL_API}/chamados/${chamadoId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Mecanico-Matricula": String(matriculaUsuario),
    },
    body: JSON.stringify(dadosChamado),
  });

  if (!resposta.ok) {
    const mensagemErro = await resposta.text();

    throw new Error(mensagemErro || "Não foi possível editar o chamado.");
  }

  return resposta.json();
}

export async function excluirChamado(chamadoId, matriculaUsuario) {
  const resposta = await fetch(`${URL_API}/chamados/${chamadoId}`, {
    method: "DELETE",
    headers: {
      "X-Mecanico-Matricula": String(matriculaUsuario),
    },
  });

  if (!resposta.ok) {
    const mensagemErro = await resposta.text();

    throw new Error(mensagemErro || "Não foi possível excluir o chamado.");
  }

  return resposta.text();
}
