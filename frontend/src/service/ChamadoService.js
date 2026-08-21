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
