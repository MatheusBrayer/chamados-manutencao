import { useState } from "react";
import { useNavigate } from "react-router";

import vulcabras from "../../img/vulcabras.png";
import { realizarLogin } from "../../service/autenticacaoService";
import "../../style/globals.css";
import "./Login.css";
import "../../style/Index.css";

function Login() {
  const [matricula, definirMatricula] = useState("");
  const [nome, definirNome] = useState("");
  const [erro, definirErro] = useState("");
  const [carregando, definirCarregando] = useState(false);

  const navegar = useNavigate();

  async function enviarFormulario(evento) {
    evento.preventDefault();

    try {
      definirCarregando(true);
      definirErro("");

      const dadosLogin = {
        matricula: Number(matricula),
        nome: nome.trim(),
      };

      const mecanico = await realizarLogin(dadosLogin);

      localStorage.setItem("usuarioLogado", JSON.stringify(mecanico));

      navegar("/dashboard");
    } catch (erroRequisicao) {
      definirErro(erroRequisicao.message);
    } finally {
      definirCarregando(false);
    }
  }

  return (
    <main className="pagina-login">
      <section className="cartao-login">
        <header className="cabecalho-login">
          <div className="logo-login">
            <img src={vulcabras} alt="logo vulcabras" />
          </div>

          <h1>Manutenção Vulcabras</h1>

          <p>Informe sua matrícula e seu nome para acessar o sistema.</p>
        </header>

        <form className="formulario-login" onSubmit={enviarFormulario}>
          <div className="campo-formulario">
            <label htmlFor="matricula">Matrícula</label>

            <input
              id="matricula"
              name="matricula"
              type="number"
              min="1"
              value={matricula}
              onChange={(evento) => definirMatricula(evento.target.value)}
              placeholder="Digite sua matrícula"
              autoComplete="username"
              disabled={carregando}
              required
            />
          </div>

          <div className="campo-formulario">
            <label htmlFor="nome">Nome</label>

            <input
              id="nome"
              name="nome"
              type="text"
              value={nome}
              onChange={(evento) => definirNome(evento.target.value)}
              placeholder="Digite seu nome completo"
              autoComplete="name"
              disabled={carregando}
              required
            />
          </div>

          {erro && (
            <p className="mensagem-erro-login" role="alert">
              {erro}
            </p>
          )}

          <button className="botao-login" type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
