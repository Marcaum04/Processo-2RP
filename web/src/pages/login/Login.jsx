import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { parseJWT} from '../../services/auth'; 

import api from '../../services/api'; 

import '../../assets/css/grid.css';
import '../../assets/css/login.css';


export const Login = () => {
  const [erroMensagem, setErroMensagem] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()

  const efetuaLogin = (event) => {
    event.preventDefault();

    setIsLoading(true);
    setErroMensagem("");

    api.post('/login', {
      email: email,
      senha: senha
    })
      .then(resposta => {
        if (resposta.status === 200) {
          localStorage.setItem('usuario-login', resposta.data.token);
          setIsLoading(false);
          setErroMensagem("");
          {parseJWT().role === '1' ? navigate('/perfil') : navigate('/');}
          
        }
      })
      .catch(resposta => {
        setIsLoading(false);
        setErroMensagem("Email e/ou senha inválidos!");
      })
  }

  return (
    <div className='container'>
      <main className="login-box">
        <h1>LogPeople</h1>
        <form>
          <div className="user-box">
            <label>E-mail</label>
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="user-box">
            <label>Senha</label>
            <input
              type="password"
              name="senha"
              value={senha}
              autoComplete="off"
              onChange={(e) => setSenha(e.target.value)} />
          </div>

          <p style={{ color: 'red' }}>{erroMensagem}</p>
          {
            isLoading === true &&
            <button type="submit" disabled>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Loading...</button>
          }
          {
            isLoading === false &&
            <button
            disabled={email === '' || senha === '' ? 'none' : ''}
            type="submit"
            onClick={(e) => efetuaLogin(e)}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Login</button>
          }
        </form>
      </main>
    </div>
  );
}

export default Login;