const URL_API = "http://localhost:8080/api";

export async function buscarSetores() {
  const resposta = await fetch(`${URL_API}/setores`);

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os setores.");
  }

  return resposta.json();
}
