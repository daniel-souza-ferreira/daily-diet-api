# 🥗 DAILY DIET API

> API desenvolvida como parte do **Desafio Prático 02** da formação em **Node.js** da plataforma **Rocketseat**. A aplicação permite o gerenciamento de usuários e suas refeições, além de fornecer métricas personalizadas.

---

## 📑 Sumário

- [📌 Sobre](#-sobre)
- [🛠 Tecnologias](#-tecnologias)
- [📡 Rotas](#-rotas)
- [⚙️ Instalação / Como usar](#️-instalação--como-usar)
- [📁 Estrutura](#estrutura) <!-- (adicione essa seção se for incluí-la de fato) -->

---

## 📌 Sobre

A aplicação contempla os seguintes requisitos:

-  Criar um usuário
-  Identificar o usuário entre as requisições por meio de `sessionId` armazenado em cookie
-  Registrar refeições com:
  - Nome
  - Descrição
  - Data e Hora
  - Indicador se está dentro ou fora da dieta
-  Editar refeições (alterando qualquer campo)
-  Deletar refeições
-  Listar todas as refeições de um usuário
-  Visualizar uma única refeição
-  Obter métricas de refeições de um usuário:
  - Total de refeições registradas
  - Total de refeições **dentro** da dieta
  - Total de refeições **fora** da dieta
  - Melhor sequência de refeições dentro da dieta (dias consecutivos)

> Cada usuário só pode visualizar, editar ou deletar **suas próprias refeições**.

---

Durante o desenvolvimento:

- As APIs foram implementadas utilizando **Node.js** com **Fastify**, garantindo desempenho e simplicidade.
- A identificação do usuário é feita via `sessionId`, gerado no momento do cadastro e armazenado em um cookie.
- Para realizar um novo cadastro e garantir o isolamento de dados, é necessário **remover manualmente o cookie anterior**.
- A biblioteca **Zod** foi utilizada para validação de dados de entrada.
- O **Knex.js** foi utilizado como query builder para interação com o banco de dados **SQLite**, além de gerenciar as *migrations* das tabelas `users` e `meals`.

---

## 🛠 Tecnologias

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Fastify](https://www.fastify.io/)
- [Dotenv](https://github.com/motdotla/dotenv)
- [Knex.js](https://knexjs.org/)
- [SQLite](https://www.sqlite.org/index.html)
- [Zod](https://zod.dev/)

---

## 📡 Rotas

| Método | Rota                | Descrição                                        |
|--------|---------------------|--------------------------------------------------|
| POST   | `/users`            | Criar novo usuário                               |
| GET    | `/users`            | Listar usuários (rota de debug)                 |
| POST   | `/meals`            | Criar nova refeição                              |
| GET    | `/meals`            | Listar todas as refeições do usuário             |
| GET    | `/meals/:id`        | Buscar uma refeição específica                   |
| GET    | `/meals/metricas`   | Obter métricas do usuário                        |
| PUT    | `/meals/:id`        | Atualizar uma refeição                           |
| DELETE | `/meals/:id`        | Deletar uma refeição                             |

---

## ⚙️ Instalação / Como usar

```bash
# Clone o repositório
git clone https://github.com/daniel-souza-ferreira/daily-diet-api.git

# Acesse o diretório do projeto
cd daily-diet-api

# Instale as dependências
npm install

# Execute as migrations (se necessário)
npx knex migrate:latest

# Inicie o servidor em modo desenvolvimento
npm run dev
