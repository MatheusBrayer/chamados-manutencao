const URL_API = "http://localhost:8080/api";

export async function buscarMecanicos() {
  const resposta = await fetch(`${URL_API}/mecanicos`);

  if (!resposta.ok) {
    const mensagemErro = await resposta.text();

    throw new Error(mensagemErro || "Não foi possível carregar os mecânicos.");
  }

  return resposta.json();
}
