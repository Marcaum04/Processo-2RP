import React from 'react';
import {createRoot} from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import './index.css';

import Home from './pages/home/Home.jsx';
import Login from './pages/login/Login.jsx';
import Perfil from './pages/perfil/Perfil.jsx';
import NotFound from './pages/notFound/NotFound.jsx';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Router>
        <Routes>
          <Route exact path="/" element={<Home />} /> {/* Home */}
          <Route path="/login" element={<Login />} /> {/* Login */}
          <Route path="/perfil" element={<Perfil />} /> {/* Perfil */}
          <Route path='*' element={<NotFound />} /> {/* Redireciona para Not Found caso não encontre nenhuma rota */}
        </Routes>
    </Router>
  </React.StrictMode>
);