-- database/init.sql
CREATE DATABASE colony_db;

\c colony_db;

-- Tabela de perfis
CREATE TABLE IF NOT EXISTS profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    cidade VARCHAR(100),
    bairro VARCHAR(100),
    fotoUrl TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de posts
CREATE TABLE IF NOT EXISTS post (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    descricao TEXT NOT NULL,
    imagemUrl TEXT,
    localizacao VARCHAR(200),
    autor UUID REFERENCES profile(id),
    criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados de exemplo
INSERT INTO profile (nome, cidade, bairro) VALUES 
('João Silva', 'São Paulo', 'Centro'),
('Maria Santos', 'Rio de Janeiro', 'Copacabana');

INSERT INTO post (descricao, imagemUrl, localizacao, autor) VALUES
('Parque lindo hoje!', 'https://example.com/photo1.jpg', 'Parque Ibirapuera', (SELECT id FROM profile WHERE nome = 'João Silva')),
('Praia maravilhosa', 'https://example.com/photo2.jpg', 'Praia de Copacabana', (SELECT id FROM profile WHERE nome = 'Maria Santos'));