CREATE DATABASE LogPeople
GO

USE LogPeople;
GO

--Tipo
CREATE TABLE Tipo(
	idTipo TINYINT PRIMARY KEY IDENTITY,
	tipo VARCHAR(256) NOT NULL
);
GO

--Usuario
CREATE TABLE Usuario(
	idUsuario INT PRIMARY KEY IDENTITY,
	idTipo TINYINT FOREIGN KEY REFERENCES Tipo(IdTipo) NOT NULL,
	foto VARCHAR(256) DEFAULT('padrao.jpg') NOT NULL,
	nome VARCHAR(256) NOT NULL,
	email VARCHAR(256) UNIQUE NOT NULL,
	senha VARCHAR(256) NOT NULL,
	ativado BIT DEFAULT(1)
);
GO