# Estrutura do Projeto - src/

Esta pasta contém todo o código-fonte da aplicação Alice Global, organizado seguindo as melhores práticas do React Native e baseado na estrutura do workwell-mobile.

## 📁 Estrutura de Pastas

```
src/
├── components/       # Componentes reutilizáveis da UI
├── core/            # Funcionalidades core da aplicação
├── hooks/           # Custom hooks React
├── screens/         # Telas da aplicação
├── services/        # Serviços e integrações
├── store/           # Gerenciamento de estado global
├── styles/          # Estilos e temas globais
├── types/           # Definições de tipos TypeScript
├── utils/           # Funções utilitárias
└── index.ts         # Exports centralizados
```

## 🧩 Components

Componentes React Native organizados por categoria:

### `components/buttons/`
Componentes de botões e ações
- **Button.tsx** - Botão principal com variantes (primary, secondary, outline)

### `components/forms/`
Componentes de formulários
- **Input.tsx** - Campo de entrada com suporte a senha e validação

### `components/layout/`
Componentes de estrutura e layout
- **Header.tsx** - Cabeçalho com título e navegação
- **Card.tsx** - Container com sombra e estilo card

### `components/feedback/`
Componentes de feedback visual
- **Loading.tsx** - Indicador de carregamento

### `components/global/`
Componentes globais compartilhados entre múltiplas features

**Import:** Use os exports centralizados
```typescript
import { Button, Input, Card, Header, Loading } from '@/components';
```

## 🎯 Core

Funcionalidades essenciais da aplicação:

### `core/providers/`
Context Providers e gerenciamento de estado global
- **AuthContext.tsx** - Autenticação e gerenciamento de usuário
- **index.ts** - Exports centralizados dos providers

### `core/navigation/`
Configuração de navegação e rotas

**Import:**
```typescript
import { AuthProvider, useAuth } from '@/core/providers';
```

## 🪝 Hooks

Custom hooks React para lógica reutilizável:
- Hooks de formulários
- Hooks de API
- Hooks de validação
- Hooks de persistência

**Exemplo:**
```typescript
// src/hooks/useForm.ts
export const useForm = (initialValues) => {
  // lógica do hook
};
```

## 📱 Screens

Telas organizadas por feature, cada uma em sua própria pasta:

- **Auth/** - Telas de autenticação (Login, Signup)
- **Dashboard/** - Tela principal do dashboard
- **Mood/** - Registro e histórico de humor
- **Breaks/** - Gerenciamento de pausas
- **Recommendations/** - Recomendações personalizadas
- **Settings/** - Configurações do app
- **About/** - Informações sobre o app

Cada pasta de screen pode conter:
- Componente principal da tela
- Componentes específicos da tela
- Lógica e hooks específicos
- Estilos locais

## 🔌 Services

Serviços e integrações com APIs:

### `services/api/`
Cliente HTTP e configuração
- **client.ts** - Instância configurada do Axios
- **config.ts** - Configuração da API (baseURL, timeout, headers)
- **mockData.ts** - Dados mockados para desenvolvimento

### `services/modules/`
Módulos de serviço por feature
- **auth.ts** - Autenticação (login, signup, logout)
- **mood.ts** - Gerenciamento de humor
- **break.ts** - Gerenciamento de pausas
- **recommendation.ts** - Recomendações
- **settings.ts** - Configurações

**Import:**
```typescript
import { api } from '@/services/api';
import { authService, moodService } from '@/services/modules';
```

## 🗄️ Store

Gerenciamento de estado global (Redux, Zustand, etc.):
- Slices/Stores por feature
- Actions e reducers
- Selectors

## 🎨 Styles

Estilos e temas globais:

### `styles/theme.ts`
Definições de tema:
- **COLORS** - Paleta de cores
- **SPACING** - Espaçamentos consistentes
- **SIZES** - Tamanhos de fonte
- **RADIUS** - Border radius

**Import:**
```typescript
import { COLORS, SPACING, SIZES, RADIUS } from '@/styles';
```

## 📝 Types

Definições de tipos TypeScript compartilhados:
- Interfaces de modelos
- Types de API
- Types de componentes
- Enums

**Import:**
```typescript
import { User, MoodEntry, Break } from '@/types';
```

## 🛠️ Utils

Funções utilitárias compartilhadas:
- Formatação de datas
- Validações
- Helpers de dados
- Constantes

## 📦 Exports Centralizados

O arquivo `src/index.ts` centraliza os exports principais:

```typescript
// Imports simplificados
import {
  Button,
  Input,
  useAuth,
  COLORS,
  User
} from '@/src';
```

## 🎯 Boas Práticas

1. **Colocation**: Mantenha arquivos relacionados próximos
2. **Single Responsibility**: Um componente, uma responsabilidade
3. **DRY**: Evite duplicação de código
4. **Naming**: Use nomes descritivos e consistentes
5. **Imports**: Prefira imports nomeados sobre default exports
6. **Types**: Sempre defina tipos TypeScript
7. **Comments**: Comente apenas o que não é óbvio

## 🔄 Fluxo de Dados

```
User Interaction
    ↓
Screen Component
    ↓
Custom Hook (opcional)
    ↓
Service Module
    ↓
API Client
    ↓
Backend/Mock
```

## 📚 Recursos

- [React Native Docs](https://reactnative.dev/)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contribuindo

Ao adicionar novo código:
1. Coloque no diretório apropriado
2. Crie index.ts para exports
3. Atualize tipos TypeScript
4. Mantenha consistência com código existente
5. Documente componentes complexos

---

**Última atualização:** Novembro 2024
**Baseado em:** workwell-mobile structure
