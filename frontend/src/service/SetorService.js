import { URL_API } from "../config/api";

export async function buscarSetores() {
  const resposta = await fetch(`${URL_API}/setores`);

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os setores.");
  }

  return resposta.json();
}
