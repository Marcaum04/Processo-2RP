import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { parseJWT} from '../../services/auth'; 

import api from '../../services/api'; 

import voltarIcon from '../../assets/img/back-icon.png'
import logoutIcon from '../../assets/img/logout-icon.png'


import '../../assets/css/grid.css';
import '../../assets/css/perfil.css';

function Perfil() {
    const [usuarioLogado, setUsuarioLogado] = useState({});
    const [carregar, setCarregar] = useState(true);
    const [editando, setEditando] = useState(false);
    const [nome, setNome] = useState("");
    const [idTipo, setIdTipo] = useState(0);
    const [email, setEmail] = useState(false);
    const [status, setStatus] = useState(true);


    const navigate = useNavigate()

    useEffect(() => {
        if (carregar === true) {
        buscaUsuarioLogado()
        setTimeout(function () { setCarregar(false) }, 1000)
      }
      });

    const irHome = () => {
        navigate('/');
    }

    const mudarEditar = () => {
        editando === false ? setEditando(true) : setEditando(false)
    }

    const editarUsuario = () => {
    var formData = new FormData();
      
      const target = document.getElementById('arquivo')
      const file = target.files[0]
      formData.append('arquivo', file, file.name)
      
      formData.append('idUsuario', usuarioLogado.idUsuario);
      formData.append('idTipo', idTipo);
      formData.append('nome', nome);
      formData.append('ativado', status);

      api.patch(`/usuarios/`, formData,{
          headers: { 
              Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
              "Content-Type": "multipart/form-data" ,
            },
        }
      )
      .then(function (response) {
        console.log(response);
        buscaUsuarioLogado()
        mudarEditar()
      })
      .catch(function (response) {
        console.log(response);
      });
    }

    const buscaUsuarioLogado = () => {
        api(`/usuarios/${parseJWT().jti}`, {
          headers: {
              Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
          },
      })
        .then(resposta => {
          if(resposta.status === 200) {
           setUsuarioLogado(resposta.data)
           setIdTipo(usuarioLogado.idTipo)
           setStatus(usuarioLogado.ativado)
           setNome(usuarioLogado.nome.toString())
           setEmail(usuarioLogado.email)
           console.log(resposta.data)
          }
        })
        .catch(ex => {
          console.log(ex)
        })
    }
    const efetuaLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('usuario-login');
        navigate('/login');
    }

    return (
      <div className="container">
        {parseJWT().role === '1' ? (
            <header className="header-home">
            <h1>LogPeople</h1>
            <span>Seja bem-vindo(a) {nome === null ? "nome" : nome.split(" ")[0]}</span>
            <div className="nav">
            <a onClick={(e) => efetuaLogout(e)}><img className="icons" src={logoutIcon} alt="icone de lougout"/></a>
            </div>
          </header>
        ) : (
        <header className="header-perfil">
        <a onClick={() => irHome()}> <img src={voltarIcon} alt="flecha para esquerda" /></a>
        </header>
        )}
        {editando === false ? 
        (
            <main className="main-perfil login-box">
            <div className="foto infos ">
            <h2>Foto de Perfil</h2>
            <img src={`http://localhost:5000/img/${usuarioLogado.foto}`} alt='Foto Perfil'/>
            </div>
            <div className="info infos ">
            <h2>Nome</h2>
            <span>{usuarioLogado.nome}</span>
            </div>
            <div className="info infos ">
            <h2>Email</h2>
            <span>{usuarioLogado.email}</span>
            </div>
            <div className="info infos ">
            <h2>Tipo</h2>
            <span>{usuarioLogado.idTipo === 1 ? "Geral" : usuarioLogado.tipo === 2 ? "Admin" : "Root"}</span>
            </div>
            <div className="info infos ">
            <h2>Status</h2>
            <span>{usuarioLogado.ativado === true ? "Ativado" : "Desativado"}</span>
            </div>
            <button onClick={() => mudarEditar()}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Editar perfil</button>
            </main>
        )
        :
        (<main className="main-perfil">
            <form className="login-box" encType="multipart/form-data">
            <div className="foto infos">
            <h2>Foto de Perfil</h2>
            <input type="file" id="arquivo" accept="image/png, image/jpeg" />
            </div>
            <div className="info infos">
            <h2>Nome</h2>
            <input 
            type="text" 
            name="nome" 
            id="nome" 
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}/>
            </div>
            <div className="info infos">
            <h2>Email</h2>
            <input 
            type="text" 
            name="email" 
            id="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="info infos">
            <h2>Tipo</h2>
            <select
            value={idTipo}
            onChange={(e) => setIdTipo(e.target.value)}>
                <option value="0" disabled> Selecione o Tipo</option>
                <option value="1"> Geral</option>
                {parseJWT().role === '1' ? (<div></div>) : (<option value="2"> Admin</option>)}
                {parseJWT().role === '1' || parseJWT().role === '2' ? (<div></div>) : (<option value="3"> Root</option>)} 
            </select>
            </div>
            <div className="info infos">
            <h2>Status</h2>
            <select
            value={status}
            onChange={(e) => {e.target.value === "1" ? setStatus(true) : setStatus(false)}}>
                <option value="0" disabled> Selecione o Tipo</option>
                <option value="1"> Ativado</option>
                <option value="2"> Desativado</option>
            </select>
            </div>

            <button type="submit" onClick={() => editarUsuario()}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Editar perfil</button>
            </form>
        </main>)
    }
    </div>
    );
  }
  
  export default Perfil;