import { URL_API } from "../config/api";

export async function realizarLogin(dadosLogin) {
  const resposta = await fetch(`${URL_API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dadosLogin),
  });

  if (!resposta.ok) {
    const mensagem = await resposta.text();

    throw new Error(mensagem || "Não foi possível realizar o login.");
  }

  return resposta.json();
}
