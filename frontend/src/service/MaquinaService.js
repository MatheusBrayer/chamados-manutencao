import { URL_API } from "../config/api";

export async function buscarMaquinas() {
  const resposta = await fetch(`${URL_API}/maquinas`);

  if (!resposta.ok) {
    const mensagemErro = await resposta.text();

    throw new Error(mensagemErro || "Não foi possível carregar as máquinas.");
  }

  return resposta.json();
}

export async function buscarMaquinaPorNp(np) {
  const resposta = await fetch(`${URL_API}/maquinas/np/${np}`);

  if (resposta.status === 404) {
    return null;
  }

  if (!resposta.ok) {
    const mensagemErro = await resposta.text();

    throw new Error(mensagemErro || "Não foi possível consultar a máquina.");
  }

  return resposta.json();
}
