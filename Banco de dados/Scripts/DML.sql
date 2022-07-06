USE LogPeople;
GO

INSERT INTO Tipo(tipo)
VALUES ('geral'),('admin'),('root')
GO

INSERT INTO Usuario(idTipo, nome, email, senha)
VALUES (3,'root','root@email.com','root@root')
GO