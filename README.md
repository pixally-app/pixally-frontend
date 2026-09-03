# Pixally - Frontend

[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8.svg)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)

Interface web do Pixally, sistema de gestão de comprovantes PIX e contas a receber para pequenos negócios. Desenvolvido com Next.js 15 e App Router como Trabalho de Conclusão de Curso.

## Sobre o Projeto

O frontend consome a [API Pixally](../pix-check-api/README.md) e oferece uma interface moderna e responsiva para upload de comprovantes PIX, acompanhamento financeiro e gestão de clientes e contas a receber.

## Páginas e Funcionalidades

### Dashboard
- Resumo financeiro do período (total recebido, pendente, vencido)
- Gráficos de evolução de recebimentos (Recharts)
- Indicadores rápidos de alertas e pendências

### Comprovantes PIX
- Upload de comprovante (imagem ou PDF)
- Visualização do comprovante com zoom e pan
- Listagem paginada com filtros por status, cliente e período
- Reconciliação com conta a receber
- Exportação da listagem em CSV

### Contas a Receber
- Cadastro com suporte a parcelamento
- Listagem paginada com totalizadores (total, recebido, pendente)
- Controle de parcelas (marcar paga/pendente individualmente)
- Cancelamento de contas

### Clientes
- CRUD completo de clientes
- Listagem paginada com busca por nome

### Alertas
- Listagem de contas com status crítico ou de atenção
- Filtros por nível de alerta

### WhatsApp
- Configuração da integração com Zapfy
- Disparo de notificações via WhatsApp

### Configurações
- Edição do perfil do usuário

## Quick Start

### Pré-requisitos
- Node.js 22+
- API Pixally rodando ([README da API](../pix-check-api/README.md))

### Rodando localmente

```bash
# 1. Clone o repositório
git clone https://github.com/Danielle1Melo/pixally-frontend.git
cd pixally-frontend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Aponte NEXT_PUBLIC_API_URL para a URL da API

# 4. Inicie o servidor de desenvolvimento
npm run dev

# 5. Acesse
# http://localhost:3001
```

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript 5 |
| Estilização | Tailwind CSS 4 |
| Componentes | Radix UI + shadcn/ui |
| Gráficos | Recharts |
| Formulários | React Hook Form + Zod |
| HTTP | Axios |
| Máscaras | IMask / react-imask |
| Moeda | react-currency-input-field |
| Toasts | Sonner |
| Ícones | Lucide React |

## Arquitetura

```
src/
├── app/
│   ├── (auth)/           # Páginas públicas: login, cadastro, recuperação de senha
│   └── (main)/           # Páginas protegidas (requerem autenticação)
│       ├── dashboard/
│       ├── receipts/
│       ├── receivables/
│       ├── clients/
│       ├── alerts/
│       ├── whatsapp/
│       └── settings/
├── components/
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── layout/           # Sidebar, header, estrutura da página
│   ├── dashboard/        # Cards e gráficos do dashboard
│   ├── receipts/         # Upload, visualizador e listagem de comprovantes
│   ├── receivables/      # Contas a receber e parcelas
│   ├── clients/          # Listagem e formulários de clientes
│   └── alerts/           # Listagem de alertas
├── services/             # Chamadas à API (Axios)
├── hooks/                # Custom hooks
├── contexts/             # Auth context e outros
├── schemas/              # Schemas de validação (Zod)
├── lib/                  # Utilitários (cn, formatters)
└── data/                 # Constantes e dados estáticos
```

## Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Licença

Este projeto está licenciado sob a [Licença MIT](./LICENSE).
