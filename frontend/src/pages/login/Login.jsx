import { useState } from "react";
import "./Login.css";
import "../../style/globals.css";
import "../../style/Index.css";
import "../../style/Index.css";
import vulcabras from "../../img/vulcabras.png";

function Login() {
  const [matricula, definirMatricula] = useState("");
  const [nome, definirNome] = useState("");

  function enviarFormulario(evento) {
    evento.preventDefault();

    const dadosLogin = {
      matricula: Number(matricula),
      nome: nome.trim(),
    };

    console.log("Dados do login:", dadosLogin);
  }

  return (
    <main className="pagina-login">
      <section className="cartao-login">
        <header className="cabecalho-login">
          <div className="logo-login">
            <img src={vulcabras} alt="Vulcabras" />
          </div>

          <h1>Chamados Manutenção</h1>

          <p>Informe sua matrícula e seu nome para acessar o sistema.</p>
        </header>

        <form className="formulario-login" onSubmit={enviarFormulario}>
          <div className="campo-formulario">
            <label htmlFor="matricula">Matrícula</label>

            <input
              id="matricula"
              name="matricula"
              type="number"
              min="4"
              value={matricula}
              onChange={(evento) => definirMatricula(evento.target.value)}
              placeholder="Digite sua matrícula"
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
              placeholder="Digite seu nome"
              autoComplete="name"
              required
            />
          </div>

          <button className="botao-login" type="submit">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
