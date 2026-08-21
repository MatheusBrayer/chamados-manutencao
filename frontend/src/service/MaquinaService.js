const URL_API = "http://localhost:8080/api";

export async function buscarMaquinaPorNp(np) {
  const resposta = await fetch(`${URL_API}/maquinas/${np}`);

  if (resposta.status === 404) {
    return null;
  }

  if (!resposta.ok) {
    throw new Error("Não foi possível consultar a máquina.");
  }

  return resposta.json();
}
