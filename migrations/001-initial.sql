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
  chipNumero TEXT,
  CONSTRAINT Equipamento_fk_veiculoId FOREIGN KEY (veiculoId)
    REFERENCES Veiculo (id) ON UPDATE CASCADE ON DELETE CASCADE
  CONSTRAINT Equipamento_ck_isBackup CHECK (isBackup IN (0, 1))
);

CREATE TABLE Posicao (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  equipamentoId INTEGER NOT NULL,
  veiculoId     INTEGER NOT NULL,
  data          TEXT NOT NULL,
  lat           REAL,
  lng           REAL,
  velocidade    REAL,
  angulo        REAL,
  odometro      REAL,
  CONSTRAINT Posicao_fk_equipamentoId FOREIGN KEY (equipamentoId)
    REFERENCES Equipamento (id) ON UPDATE CASCADE ON DELETE CASCADE
  CONSTRAINT Posicao_fk_veiculoId FOREIGN KEY (veiculoId)
    REFERENCES Veiculo (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX Equipamento_ix_veiculoId ON Equipamento (veiculoId);

CREATE INDEX Posicao_ix_equipamentoId on Posicao (equipamentoId);
CREATE INDEX Posicao_ix_veiculoId on Posicao (veiculoId);
CREATE INDEX Posicao_ix_data on Posicao (data);

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