# Migração para estrutura src/

## O que mudou?

O projeto foi reestruturado para seguir a convenção moderna de projetos (similar ao Next.js), onde todo o código fonte principal está organizado dentro do diretório `src/`.

### Antes
```
alfred/
├── components/
├── store/
├── services/
├── types/
├── utils/
├── hooks/
└── constants/
```

### Depois
```
alfred/
├── app/           # Rotas Expo Router (sem mudanças)
├── src/           # Todo código fonte aqui
│   ├── components/
│   ├── store/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── hooks/
│   └── constants/
└── assets/        # Assets estáticos
```

## Configuração TypeScript

O arquivo `tsconfig.json` foi atualizado com path mappings específicos:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/store/*": ["./src/store/*"],
      "@/services/*": ["./src/services/*"],
      "@/types": ["./src/types"],
      "@/utils/*": ["./src/utils/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/constants/*": ["./src/constants/*"]
    }
  }
}
```

## Imports

Todos os imports usando `@/` continuam funcionando normalmente:

```typescript
// Antes e depois - mesmo código
import { Button } from '@/components/common/Button';
import { useUserStore } from '@/store/useUserStore';
import { formatCurrency } from '@/utils/formatters';
```

O prefixo `@/` agora mapeia automaticamente para `src/`.

## Benefícios

1. **Organização clara**: Separação entre rotas (`app/`) e código fonte (`src/`)
2. **Convenção padrão**: Segue o padrão usado em Next.js e outros frameworks modernos
3. **Escalabilidade**: Mais fácil de adicionar novos diretórios sem poluir a raiz
4. **IntelliSense melhorado**: IDEs entendem melhor a estrutura com path mappings explícitos

## O que NÃO mudou

- Todos os imports continuam usando `@/`
- Estrutura de pastas dentro de `src/` permanece igual
- Código das rotas em `app/` não foi alterado
- Configurações (tailwind.config.js, metro.config.js, etc) permanecem na raiz

## Checklist de Migração

- ✅ Criar diretório `src/`
- ✅ Mover todos os diretórios de código para `src/`
- ✅ Atualizar `tsconfig.json` com novos paths
- ✅ Verificar que todos os imports continuam funcionando
- ✅ Atualizar documentação (README.md e CLAUDE.md)

## Próximos Passos

A estrutura está pronta. Para continuar o desenvolvimento:

1. Use `@/` para imports (exemplo: `@/components/common/Button`)
2. Novos arquivos devem ser criados dentro de `src/`
3. Mantenha apenas rotas em `app/`
