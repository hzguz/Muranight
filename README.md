# MuraNight (Chrome + Edge)

Extensão Manifest V3 para aplicar filtro de conforto visual e modo noturno por URL exata (`origin + pathname + search`, ignorando `hash`) ou globalmente em todas as páginas compatíveis.

## Recursos Principais

- **2 modos de aplicação**:
  - **Por página**: ativação independente por URL exata (com suporte a navegação SPA).
  - **Todas as páginas**: aplicação global automática.
- **Intensidade contínua e Boost**:
  - Controle em tempo real de `0%` até `200%` (expansível até `500%` nas configurações) combinando camada de matiz (`multiply`) e camada de escurecimento (`dim`).
- **3 modos de cor**:
  - **Amarelada (Warm)**, **Azul (Blue)** e **Personalizada (Custom)** com seletor visual e código HEX.
- **Agendamento de horário**:
  - Ativação e desativação automáticas dentro da janela de horário configurada.
- **Acessibilidade (Sempre Ativa)**:
  - Reduzir movimento (transições/animações e vídeos em autoplay), suavizar brilho, reduzir cores fortes e mitigar flashes.
- **Perfis locais e Backup**:
  - Criação e aplicação rápida de perfis locais, além de exportação/importação de configurações em arquivo `.txt`/`.json`.
- **Multilíngue**:
  - Interface traduzida para Português (Brasil), Inglês, Espanhol, Francês e Alemão (detecção automática ou seleção manual).
- **Suporte a Tela Cheia (Fullscreen)**:
  - O filtro acompanha vídeos e elementos em tela cheia automaticamente.

## Desenvolvimento e Build (Tailwind CSS)

- Fonte de estilos: [`src/popup.tailwind.css`](src/popup.tailwind.css)
- Saída compilada: [`popup.css`](popup.css)

```bash
# Instalar dependências de desenvolvimento
npm install

# Compilar CSS minificado do popup
npm run build:css

# Modo watch durante ajustes de UI
npm run watch:css

# Executar verificações pré-publicação (Chrome Web Store)
npm run release:preflight

# Gerar pacote .zip limpo em .release/
npm run release
```

## Como carregar localmente no Chrome / Edge

1. Abra `chrome://extensions` (ou `edge://extensions`).
2. Ative o **Modo do desenvolvedor**.
3. Clique em **Carregar sem compactação** (*Load unpacked*).
4. Selecione a pasta raiz deste projeto (`muranight`).

## Estrutura Principal

- `manifest.json` — Configuração Manifest V3 da extensão
- `content.js` — Script injetado em `document_start` (overlays, agendamento, acessibilidade e fullscreen)
- `popup.html` / `popup.js` / `popup.css` — Interface de controle e gerenciamento de estado
- `src/popup.tailwind.css` — Estilos fonte Tailwind CSS e `@font-face` locais (`Open Sans`)
- `scripts/release/` — Scripts de validação (`preflight.mjs`) e empacotamento (`package.mjs`)

## Licença

Distribuído sob a licença [MIT](LICENSE).
