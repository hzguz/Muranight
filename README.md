# MuraNight (Chrome + Edge)

Extensao MV3 para aplicar modo noturno por URL exata (`origin + pathname + search`, ignorando `hash`) ou globalmente.

## Recursos
- 2 modos de uso:
  - Individual por pagina (por URL exata).
  - Todas as paginas (global por padrao).
- Ativar/desativar por URL da aba atual (no modo individual).
- Intensidade de 0 a 100 em tempo real.
- 3 cores: amarelada (padrao), azul e personalizada (color picker + HEX).
- Persistencia em `chrome.storage.local`.
- Reaplicacao automatica:
  - No modo individual: quando abrir novamente a mesma URL.
  - No modo global: em todas as paginas suportadas.
- Intensidade reforcada no 100% com camada de escurecimento + camada de cor.

## UI com Tailwind (compilado)
- Fonte de estilos: `src/popup.tailwind.css`
- Saida compilada: `popup.css`
- Build:
  - `npm.cmd run build:css`
- Watch (durante ajustes de UI):
  - `npm.cmd run watch:css`

## Como carregar no Chrome
1. Abra `chrome://extensions`.
2. Ative `Modo do desenvolvedor`.
3. Clique em `Carregar sem compactacao`.
4. Selecione esta pasta (`muranight`).

## Como carregar no Edge
1. Abra `edge://extensions`.
2. Ative `Modo de desenvolvedor`.
3. Clique em `Carregar sem compactacao`.
4. Selecione esta pasta (`muranight`).

## Estrutura principal
- `manifest.json`
- `content.js`
- `popup.html`
- `popup.css`
- `popup.js`
- `src/popup.tailwind.css`
- `tailwind.config.js`
