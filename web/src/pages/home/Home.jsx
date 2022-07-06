import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { parseJWT} from '../../services/auth'; 

import api from '../../services/api'; 

import editarIcon from '../../assets/img/edit-icon.svg'
import deletarIcon from '../../assets/img/delete-icon.png'
import logoutIcon from '../../assets/img/logout-icon.png'
import plusIcon from '../../assets/img/plus-icon.svg'

import '../../assets/css/homePage.css';
import '../../assets/css/grid.css';

function Home() {
  const [usuarioLogado, setUsuarioLogado] = useState({});
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [carregar, setCarregar] = useState(true);
  const [idTipo, setIdTipo] = useState(0);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(true);
  const [senha, setSenha] = useState('');
  const [idUsuario, setIdUsuario] = useState(0);
  
  const navigate = useNavigate()

  useEffect(() => {
    if (carregar === true) {
      if (parseJWT().role !== '1') {
        buscaUsuarios()
      }
    buscaUsuarioLogado()
    setTimeout(function () { setCarregar(false) }, 1000)
  }
  });

  const efetuaLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('usuario-login');
    navigate('/login');
  }

  const cadastrarUsuario = () => {
    var formData = new FormData();
      
      const target = document.getElementById('arquivo')
      const file = target.files[0]

      if (target !== null) {
        formData.append('arquivo', file, file.name)
      }else{
        formData.append('arquivo', null)
      }
      
      formData.append('idTipo', idTipo);
      formData.append('nome', nome);
      formData.append('email', email);
      formData.append('ativado', status);
      formData.append('senha', senha);

      api.post(`/usuarios/`, formData,{
          headers: { 
              Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
              "Content-Type": "multipart/form-data" ,
            },
        }
      )
      .then(function (response) {
        console.log(response);
        buscaUsuarios()
      })
      .catch(function (response) {
        console.log(response);
      });
    }

    const editarUsuario = () => {
      var formData = new FormData();
        
        const target = document.getElementById('arquivo')
        const file = target.files[0]
        if (target !== null) {
          formData.append('arquivo', file, file.name)
        }else{
          formData.append('arquivo', null)
        }
        
        formData.append('idUsuario', idUsuario);
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
          buscaUsuarios()
        })
        .catch(function (response) {
          console.log(response);
        });
      }

  const irPerfil = () => {
    navigate('/perfil');
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
      }
    })
    .catch(ex => {
      console.log(ex)
    })
  }

  const buscaUsuarios = () => {
    api(`/usuarios`, {
      headers: {
          Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
      },
  })
    .then(resposta => {
      if(resposta.status === 200) {
      setUsuarios(resposta.data)
      console.log(usuarios)
      }
    })
    .catch(ex => {
      console.log(ex)
    })
  }

  const deletaUsuario = (id) => {
    api.delete(`/usuarios/${id}`, {
      headers: {
          Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
      },
  })
    .then(resposta => {
      if(resposta.status === 204) {
        buscaUsuarios();
      }
    })
    .catch(ex => {
      console.log(ex)
    })
  }

    return (
      <div className="container">
        <header className="header-home">
          <h1>LogPeople</h1>
          <span>Seja bem-vindo(a) {nome === null ? "nome" : nome.split(" ")[0]}</span>
          <div className="nav">
          <a onClick={() => irPerfil()}><img className="imgPerfil icons" src={`http://localhost:5000/img/${usuarioLogado.foto}`} alt='Foto Perfil'/></a>
          <a onClick={(e) => efetuaLogout(e)}><img className="icons" src={logoutIcon} alt="icone de lougout"/></a>
          </div>
        </header>
        <main className="main-perfil main-home">
        <form className="form-home login-box alinhar" encType="multipart/form-data">
            <div className="foto infos user-box">
            <h2>Cadastrar ou Editar Usuário</h2>
            <h2>Foto de Perfil</h2>
            <input type="file" id="arquivo" accept="image/png, image/jpeg" />
            </div>
            <div className="info infos user-box">
            <h2>Id do Usuário</h2>
            <select
            value={idUsuario}
            onChange={(e) => setIdUsuario(e.target.value)}>
                <option value="0" disabled> Selecione o id do Usuário</option>
                {usuarios.map((usuario) => {

                  return(
                    (parseJWT().jti === usuario.idUsuario.toString() ? (<div></div>):(
                      <option key={usuario.idUsuario} value={usuario.idUsuario}>{usuario.idUsuario}</option>
                    ))
                    )})
                }
            </select>
            </div>
            <div className="info infos user-box">
            <h2>Nome</h2>
            <input 
            type="text" 
            name="nome" 
            id="nome" 
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}/>
            </div>
            <div className="info infos user-box">
            <h2>Email</h2>
            <input 
            type="text" 
            name="email" 
            id="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="info infos user-box">
            <h2>Senha</h2>
            <input 
            type="text" 
            name="senha" 
            id="senha" 
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}/>
            </div>
            <div className="info infos user-box">
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
            <div className="info infos user-box">
            <h2>Status</h2>
            <select
            value={status}
            onChange={(e) => {e.target.value === "1" ? setStatus(true) : setStatus(false)}}>
                <option value="0" disabled> Selecione o Tipo</option>
                <option value="1"> Ativado</option>
                <option value="2"> Desativado</option>
            </select>
            </div>

            <div className="buttons">
              <button type="submit" onClick={() => editarUsuario()}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
                <img className="icons" src={editarIcon} alt='icone de lápis'/></button>
              <button type="submit" onClick={() => cadastrarUsuario()}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
                <img className="icons" src={plusIcon} alt='icone de mais'/></button>
            </div>
          </form>

          <table>
            <thead>
              <tr className="titulo">
                <th>Id</th>
                <th>Foto</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Status</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => {
                return(
                  (
                    parseJWT().jti === usuario.idUsuario.toString() ? (<div></div>) : (

                    <tr key={usuario.idUsuario} className="linha">
                    <th>{usuario.idUsuario}</th>
                    <th>
                      <img className="imgPerfil" src={`http://localhost:5000/img/${usuario.foto}`} alt='Foto Perfil'/>
                    </th>
                    <th>{usuario.nome}</th>
                    <th>{usuario.email}</th>
                    <th>{usuario.idTipo === 1 ? "Geral" : usuario.idTipo === 2 ? "Admin" : "Root"}</th>
                    <th>{usuario.ativado === true ? "Ativado" : "Desativado"}</th>
                    {parseJWT().role === "3" ? (<th><a onClick={(id) => deletaUsuario(usuario.idUsuario)}><img className="icons" src={deletarIcon} alt='icone de lixeira'/></a></th>):(<div></div>)}
                    </tr>
                    )
                  )
                )
              })}
            </tbody>
          </table>
        </main>
      </div>
    );
  }
  
  export default Home;