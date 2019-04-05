--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE Veiculo (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  placa    TEXT    NOT NULL
);

CREATE TABLE Equipamento (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  serial     TEXT     NOT NULL,
  veiculoId  INTEGER,
  isBackup   NUMERIC  NOT NULL DEFAULT 0,
  CONSTRAINT Equipamento_fk_veiculoId FOREIGN KEY (veiculoId)
    REFERENCES Veiculo (id) ON UPDATE CASCADE ON DELETE CASCADE
  CONSTRAINT Equipamento_ck_isBackup CHECK (isBackup IN (0, 1))
);

CREATE TABLE Posicao (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  veiculoId   INTEGER NOT NULL,
  data        DATE NOT NULL,
  lat         NUMERIC,
  lng         NUMERIC,
  CONSTRAINT Posicao_fk_veiculoId FOREIGN KEY (veiculoId)
    REFERENCES Veiculo (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX Equipamento_ix_veiculoId ON Equipamento (veiculoId);

CREATE INDEX Posicao_ix_veiculoId on Posicao (veiculoId);

INSERT INTO Veiculo (id, placa) VALUES (1, 'ABC1C34');

INSERT INTO Equipamento (id, serial, veiculoId, isBackup) VALUES (1, '01234', 1, 0);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP INDEX Equipamento_ix_veiculoId;
DROP INDEX Posicao_ix_veiculoId;
DROP TABLE Veiculo;
DROP TABLE Equipamento;
DROP TABLE Posicao;