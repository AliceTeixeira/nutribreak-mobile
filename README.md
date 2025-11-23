# NutriBreak Mobile

Aplicativo mobile desenvolvido em React Native para a Global Solution - FIAP 2024.

## Integrantes do Grupo

- [Nome do Integrante 1] - RM XXXXX
- [Nome do Integrante 2] - RM XXXXX
- [Nome do Integrante 3] - RM XXXXX

## Vídeo de Apresentação

[Link do Vídeo no YouTube](https://youtube.com/...)

## Sobre o Projeto

NutriBreak é uma plataforma que usa inteligência artificial para ajudar profissionais a manterem uma rotina de trabalho mais saudável, equilibrada e produtiva.

Com base no humor, nível de energia, tipo de jornada (remota, híbrida ou presencial) e tempo de tela, a IA recomenda pausas e cardápios personalizados para melhorar foco, bem-estar e desempenho.

### Objetivos

- Promover saúde física e mental no trabalho
- Pausas inteligentes personalizadas
- Sugestões de alimentação equilibrada
- Alinhado aos ODS 3 (Saúde e bem-estar) e ODS 8 (Trabalho decente)

## Funcionalidades Principais

1. **Cadastro Personalizado** - Nome, tipo de jornada, preferências alimentares, metas de bem-estar
2. **Registro Diário** - Humor, energia e tempo de trabalho
3. **IA de Recomendações** - Pausas e cardápios personalizados
4. **Lembretes Inteligentes** - Notificações de pausas e hidratação
5. **Histórico de Bem-estar** - Gráficos e correlações

## Arquitetura do Projeto

```
alice-global/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── buttons/
│   │   ├── forms/
│   │   ├── feedback/
│   │   └── layout/
│   ├── screens/             # Telas do aplicativo
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Mood/
│   │   ├── Recommendations/
│   │   ├── Breaks/
│   │   ├── Settings/
│   │   └── About/
│   ├── services/            # Serviços de API
│   │   ├── api/
│   │   └── modules/
│   ├── core/                # Navegação e providers
│   │   ├── navigation/
│   │   └── providers/
│   ├── styles/              # Estilos e tema
│   ├── types/               # TypeScript types
│   └── utils/               # Utilitários
├── assets/                  # Imagens e recursos
├── app.json                 # Configuração Expo
├── package.json
└── README.md
```

## Tecnologias Utilizadas

- React Native 0.81.5
- Expo ~54.0.0
- TypeScript ~5.9.2
- React Navigation 7.0.0
- Axios 1.7.0
- AsyncStorage 2.2.0
- Expo Notifications 0.32.13

## Requisitos Atendidos

### Telas e Navegação (10 pts)
- 7 telas distintas com navegação fluida
- Login, Signup, Dashboard, Humor, Recomendações, Pausas, Configurações, Sobre

### CRUD com API (30 pts)
- Integração completa com API REST usando Axios
- Create, Read, Update, Delete implementados
- Tratamento de erros e feedback visual
- Serviços separados para cada recurso

### Autenticação (20 pts)
- Sistema completo de Login e Signup
- Logout funcional com limpeza de sessão
- Proteção de rotas com Context API
- Validação de formulários
- Armazenamento seguro de token

### Estilização (5 pts)
- Identidade visual personalizada
- Tema com cor principal rosa claro (#FFB6C1)
- Design consistente em todas as telas
- Componentes estilizados

### Arquitetura (20 pts)
- Organização lógica de arquivos e pastas
- Separação de responsabilidades
- Código limpo e bem estruturado
- Nomeação padronizada
- Uso de TypeScript

### Vídeo de Funcionalidades (10 pts)
- Link disponível acima

### Publicação (5 pts)
- Configurado para Firebase App Distribution
- Tela "Sobre o App" com hash do commit

## Como Executar

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- Expo CLI instalado globalmente
- Expo Go no dispositivo móvel (para testes)

### Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd alice-global
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL da API:

Edite o arquivo `src/services/api/config.ts` e ajuste a `baseURL` para apontar para sua API:

```typescript
export const API_CONFIG = {
  baseURL: 'http://SEU_IP:PORTA/api',
  timeout: 10000,
};
```

4. Inicie o projeto:
```bash
npm start
```

5. Execute no dispositivo:

- Android: Escaneie o QR Code com o Expo Go
- iOS: Escaneie o QR Code com a câmera

### Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento Expo
- `npm run android` - Inicia no Android
- `npm run ios` - Inicia no iOS
- `npm run web` - Inicia na web

## Telas do Aplicativo

### Autenticação
- **Login**: Autenticação com email e senha
- **Signup**: Cadastro de novos usuários

### Principais
- **Dashboard**: Visão geral do dia e estatísticas
- **Humor**: Registro diário de humor e energia (CRUD)
- **Recomendações**: Sugestões personalizadas da IA
- **Pausas**: Gerenciamento de pausas (CRUD)
- **Configurações**: Ajustes e preferências do usuário

### Outras
- **Sobre**: Informações do app e hash do commit

## Integração com API

O aplicativo está preparado para integrar com APIs desenvolvidas em:
- Java (Spring Boot)
- .NET (ASP.NET Core)

Todos os endpoints estão configurados em `src/services/api/config.ts`.

## Funcionalidades CRUD

### Humor (Mood)
- Create: Registrar novo humor
- Read: Listar histórico de humores
- Update: Atualizar registro
- Delete: Remover registro

### Pausas (Breaks)
- Create: Agendar nova pausa
- Read: Listar pausas
- Update: Marcar como concluída ou pulada
- Delete: Remover pausa

### Recomendações
- Read: Listar recomendações
- Create: Gerar novas recomendações
- Update: Marcar como concluída

### Configurações
- Read: Obter configurações
- Update: Atualizar preferências

## Design System

### Cores Principais
- Primary: #FFB6C1 (Rosa Claro)
- Secondary: #FFF0F3
- Success: #00B894
- Error: #D63031

### Componentes
- Button (Primary, Secondary, Outline)
- Input (com validação)
- Card (container estilizado)
- Header (navegação)
- Loading (feedback visual)

## Publicação

### Firebase App Distribution

1. Instale o Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Faça login no Firebase:
```bash
firebase login
```

3. Build do app:
```bash
eas build --platform android --profile preview
```

4. Publique no App Distribution:
```bash
firebase appdistribution:distribute [APK_PATH] --app [APP_ID]
```

## Estrutura de Desenvolvimento

O projeto segue uma arquitetura modular com separação clara de responsabilidades:

- **Components**: Componentes reutilizáveis da interface
- **Screens**: Telas do aplicativo
- **Services**: Lógica de negócio e integração com API
- **Core**: Configurações centrais (navegação, providers)
- **Types**: Definições TypeScript
- **Styles**: Tema e estilos globais

## Testes

Para testar o aplicativo sem API:
- Os serviços estão preparados com tratamento de erro
- Dados mockados podem ser usados para desenvolvimento

## Licença

Este projeto foi desenvolvido para fins educacionais - Global Solution FIAP 2024.

## Contribuindo

Este é um projeto acadêmico. Contribuições são bem-vindas via pull requests.

## Contato

Para dúvidas sobre o projeto, entre em contato com os integrantes do grupo.

---

Desenvolvido para a Global Solution - FIAP 2024
