-- database/init.sql
CREATE DATABASE colony_db;

\c colony_db;

-- Tabela de perfis
CREATE TABLE IF NOT EXISTS profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL, -- ✅ ADICIONAR
    password VARCHAR(255) NOT NULL, -- ✅ ADICIONAR
    cidade VARCHAR(100),
    bairro VARCHAR(100),
    fotoUrl TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de posts (atualizada com novos campos)
CREATE TABLE IF NOT EXISTS post (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    descricao TEXT NOT NULL,
    imagemUrl TEXT,
    localizacao VARCHAR(200),
    latitude DECIMAL(10, 6), -- ✅ ADICIONAR
    longitude DECIMAL(10, 6), -- ✅ ADICIONAR
    tipo_animal VARCHAR(50) DEFAULT 'outros', -- ✅ ADICIONAR
    status VARCHAR(50) DEFAULT 'perdido', -- ✅ ADICIONAR
    autor_id UUID REFERENCES profile(id),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados de exemplo (atualizado)
INSERT INTO profile (nome, email, password, cidade, bairro) VALUES 
('João Silva', 'joao@email.com', '$2b$12$hashedpassword1', 'São Paulo', 'Centro'),
('Maria Santos', 'maria@email.com', '$2b$12$hashedpassword2', 'Rio de Janeiro', 'Copacabana');

INSERT INTO post (descricao, imagemUrl, localizacao, latitude, longitude, autor_id) VALUES
('Parque lindo hoje!', 'https://example.com/photo1.jpg', 'Parque Ibirapuera', -23.5875, -46.6576, (SELECT id FROM profile WHERE nome = 'João Silva')),
('Praia maravilhosa', 'https://example.com/photo2.jpg', 'Praia de Copacabana', -22.9707, -43.1820, (SELECT id FROM profile WHERE nome = 'Maria Santos'));