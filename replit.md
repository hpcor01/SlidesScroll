# Gestão de Slides

Sistema de gerenciamento de slides com paginação, detecção inteligente de duplicatas e visualização otimizada de conteúdo.

## Visão Geral

Aplicação web moderna para cadastro e visualização de slides com três recursos principais:

1. **Paginação Funcional** - Navegação eficiente através de grandes volumes de slides
2. **Truncamento Inteligente de Texto** - Exibição otimizada com expansão/recolhimento para textos longos
3. **Detecção de Duplicatas** - Comparação inteligente usando similaridade fuzzy (Levenshtein)

## Arquitetura do Projeto

### Stack Tecnológico

**Frontend:**
- React 18 com TypeScript
- Wouter para roteamento
- TanStack Query para gerenciamento de estado e cache
- Shadcn UI + Tailwind CSS para componentes
- React Hook Form + Zod para validação de formulários

**Backend:**
- Express.js
- Armazenamento em memória (MemStorage)
- Biblioteca string-similarity para detecção de duplicatas

### Estrutura de Dados

```typescript
interface Slide {
  id: string;
  assunto: string;  // Título/assunto do slide
  texto: string;    // Conteúdo principal
  autor: string;    // Nome do autor
  data: Date;       // Data de criação
}
```

## Recursos Implementados

### 1. Paginação

- **Backend**: GET `/api/slides?page=1&perPage=10`
- **Frontend**: Controles de navegação com números de página, botões anterior/próximo
- **UX**: Exibe contagem de itens ("Mostrando 1 a 10 de 47 slides")
- **Performance**: 10 slides por página (configurável)

### 2. Truncamento de Texto ("ver mais" / "ver menos")

- **Detecção**: Calcula altura renderizada para determinar se o texto excede 5 linhas
- **Método**: CSS `line-clamp-5` combinado com detecção JavaScript de overflow
- **Funcionalidade**: Funciona tanto para parágrafos longos quanto texto com quebras de linha
- **Responsivo**: Recalcula overflow em redimensionamento de janela

### 3. Detecção de Duplicatas

- **Algoritmo**: Comparação de strings usando distância de Levenshtein
- **Ponderação**: 70% similaridade do texto + 30% similaridade do assunto
- **Limite**: 50% de similaridade para considerar duplicata
- **UX**: 
  - Verificação em tempo real com debounce de 800ms
  - Painel de aviso visual mostrando matches e porcentagens
  - Usuário pode cancelar ou prosseguir mesmo com duplicata detectada

## Endpoints da API

### GET /api/slides
Lista slides com paginação.

**Query Parameters:**
- `page` (número, padrão: 1)
- `perPage` (número, padrão: 10, máx: 100)

**Resposta:**
```json
{
  "data": [...slides],
  "total": 47,
  "page": 1,
  "perPage": 10,
  "totalPages": 5
}
```

### GET /api/slides/check-duplicate
Verifica duplicatas antes de criar slide.

**Query Parameters:**
- `texto` (string, obrigatório)
- `assunto` (string, opcional)

**Resposta:**
```json
{
  "isDuplicate": true,
  "matches": [
    {
      "slide": {...},
      "similarity": 0.85
    }
  ]
}
```

### POST /api/slides
Cria novo slide.

**Body:**
```json
{
  "assunto": "Título do slide",
  "texto": "Conteúdo detalhado...",
  "autor": "Nome do autor"
}
```

## Componentes Principais

### SlideCard
- Exibe informações do slide em card estilizado
- Truncamento inteligente de texto
- Botão "ver mais"/"ver menos" quando aplicável
- Metadados: autor e data formatada em português

### PaginationControls
- Navegação com números de página
- Botões anterior/próximo com estados desabilitados
- Indicador de range de itens
- Reticências (...) para páginas omitidas

### DuplicateWarning
- Alert destacado quando duplicatas são encontradas
- Lista até 3 matches mais similares
- Badges coloridos por nível de similaridade:
  - ≥80%: vermelho (alta similaridade)
  - 60-79%: amarelo (média similaridade)
  - <60%: verde (baixa similaridade)
- Botões "Cancelar" e "Continuar mesmo assim"

### SlideForm
- Formulário com validação Zod
- Verificação de duplicatas em tempo real
- Estados de loading e submissão
- Feedback via toast notifications

## Interface de Usuário

- **Idioma**: Português (pt-BR)
- **Layout**: Responsivo com sidebar sticky no desktop
- **Design**: Seguindo design guidelines modernas com:
  - Cores consistentes (modo claro/escuro)
  - Espaçamento harmônico
  - Interações suaves (hover-elevate)
  - Componentes Shadcn UI
- **Acessibilidade**: 
  - Atributos data-testid em elementos interativos
  - Labels semânticos
  - Estados de foco visíveis

## Alterações Recentes

**2025-10-19**
- Implementação completa do sistema de slides
- Paginação funcional com backend e frontend integrados
- Sistema de truncamento baseado em altura renderizada (não apenas quebras de linha)
- Detecção de duplicatas com fuzzy matching e UI de avisos
- Interface em português com formatação de datas pt-BR
- Testes end-to-end passando em todos os cenários

## Próximos Passos Sugeridos

1. **Persistência**: Migrar de MemStorage para PostgreSQL para retenção de dados
2. **Edição**: Adicionar funcionalidade de editar/excluir slides existentes
3. **Busca**: Implementar busca/filtro por assunto ou autor
4. **Categorias**: Sistema de tags ou categorias para organização
5. **Exportação**: Permitir exportar slides em diferentes formatos
6. **Performance**: Monitorar recálculo de overflow em resize para grandes listas

## Como Executar

O projeto está configurado para rodar automaticamente:
```bash
npm run dev
```

Acesse em: http://localhost:5000
