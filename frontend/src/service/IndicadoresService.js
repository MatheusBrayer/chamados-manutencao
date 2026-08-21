const URL_API = "http://localhost:8080/api";

export async function buscarIndicadores() {
  const resposta = await fetch(`${URL_API}/indicadores`);

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os indicadores.");
  }

  return resposta.json();
}
