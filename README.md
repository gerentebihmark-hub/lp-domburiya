# LP Domburiya by Hachimitsu — Londrina/PR

Landing Page oficial de alta conversão do **Domburiya by Hachimitsu** (primeiro restaurante do grupo Hachimitsu em Londrina/PR), construída em **HTML5 + CSS3 + JavaScript Vanilla + Vite**.

## Como rodar localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento com Hot Reload:
   ```bash
   npm run dev
   ```
3. Gere a versão otimizada de produção (`dist/`):
   ```bash
   npm run build
   ```
4. Visualize o build de produção localmente:
   ```bash
   npm run preview
   ```

## Variáveis de Ambiente (`.env.example`)
Copie `.env.example` para `.env.local` (nunca commitado) e preencha os IDs públicos quando aplicável:
- `VITE_GA_ID`: ID do Google Analytics 4
- `VITE_GTM_ID`: ID do Google Tag Manager
- `VITE_META_PIXEL_ID`: ID do Pixel da Meta

## Estrutura do Projeto
- `index.html`: Página principal com Cardápio Fotográfico dos 24 pratos, Anatomia da Tigela, Comparativo das 2 Unidades (Gleba Palhano e Centro), Status de Horário ao vivo e Central de Delivery.
- `obrigado.html`: Página de confirmação de contato e atalhos rápidos.
- `style.css`: Sistema de design em Light Mode quente com blocos editoriais vermelho lacado, zero pills decorativas e responsividade mobile-first.
- `main.js`: Lógica de filtro dos 24 pratos, anatomia interativa, cálculo de horário de funcionamento em tempo real (Londrina/PR), rastreamento GA4/Meta condicionado à LGPD e higienização de formulários.
- `DOSSIE_ESTRATEGICO.md`: Briefing estratégico, matriz de evidências, copywriting e direção visual.
- `SECURITY_AND_COMPLIANCE.md`: Governança de segurança, cabeçalhos HTTP e conformidade com a LGPD.
