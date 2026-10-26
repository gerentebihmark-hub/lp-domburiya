# Segurança, Privacidade (LGPD) e Conformidade — LP Domburiya by Hachimitsu

Este documento descreve os protocolos de segurança da informação, proteção de dados pessoais (Lei nº 13.709/2018 — LGPD) e governança técnica aplicados na Landing Page oficial do **Domburiya by Hachimitsu** (`https://www.domburiya.com.br`).

---

## 1. Governança de Credenciais e Repositório
- **Zero Segredos Hardcoded:** Nenhuma chave privada, token de API ou credencial sensível reside no código-fonte.
- **Proteção Git (`.gitignore`):** Criado antes da inicialização do repositório (`git init`) para bloquear arquivos `.env*`, pastas de build (`dist/`, `build/`), logs e `node_modules/`.
- **Separação Client-Side vs. Server-Side:** Variáveis com prefixo `VITE_` (`VITE_GA_ID`, `VITE_GTM_ID`, `VITE_META_PIXEL_ID`) são reservadas exclusivamente para identificadores públicos de telemetria front-end e só disparam mediante consentimento explícito do usuário.

---

## 2. Conformidade com a LGPD (Lei nº 13.709/2018)
- **Minimização de Dados:** A página prioriza o direcionamento direto para os canais oficiais de pedido (**Cloudfy Delivery**, **iFood** e **Rappi**) e contato telefônico/presencial das duas unidades em Londrina/PR, sem coletar dados pessoais desnecessários.
- **Formulário de Contato / Eventos Corporativos (Opcional):** Solicita apenas Nome, Telefone/WhatsApp, Unidade de interesse e Mensagem, com checkbox de consentimento desmarcado por padrão (opt-in explícito).
- **Banner Granular de Cookies LGPD:**
  - Separa explicitamente as categorias **Necessários** (sempre ativos para funcionamento da interface), **Analíticos (GA4)** e **Marketing (Meta Pixel)** com controles independentes de opt-in.
  - O registro de preferência é salvo localmente em `localStorage` (`domburiya_lgpd_consent_v1`) com carimbo de data/hora.
- **Retenção, Descarte e Direitos do Titular:**
  - Mensagens enviadas pelo canal de contato institucional têm finalidade exclusiva de atendimento ao cliente e são retidas pelo prazo máximo de 12 meses ou até solicitação de descarte.
  - O titular pode solicitar confirmação, acesso, correção ou exclusão de dados a qualquer momento pelo e-mail oficial **`contato@domburiya.com.br`** ou pelos telefones **`(43) 3326-6373`** (Gleba Palhano) e **`(43) 3027-4353`** (Centro).

---

## 3. Segurança Front-End e Cabeçalhos HTTP
- **Sanitização Contra XSS:** Todos os parâmetros de busca/filtro do cardápio e campos de contato passam por higienização rigorosa (`trim`, remoção de caracteres de controle e tags HTML) e renderização segura via `textContent`.
- **Proteção Anti-Spam (Honeypot) & Rate Limiting Local:** O formulário de contato institucional conta com campo oculto (`website_hp`) com `tabindex="-1"` e `aria-hidden="true"`, além de trava de intervalo mínimo entre envios para bloquear automação abusiva.
- **Links Externos Seguros:** Todos os links externos (`target="_blank"`) utilizam obrigatoriamente `rel="noopener noreferrer"`.
- **Headers HTTP de Segurança (via `vercel.json`):**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 4. Rotas BLINK (Link-in-Bio Oficial por Unidade)
- **`/blinkgleba`** (`https://domburiya.com.br/blinkgleba`): Unidade Gleba Palhano (Rua João Wyclif, 500 · Galeria Alameda Jardino, Loja 4, Londrina/PR · Tel/WhatsApp: `(43) 3326-6373`).
- **`/blinkcentro`** (`https://domburiya.com.br/blinkcentro`): Unidade Centro (Rua Pernambuco, 682 · Centro, Londrina/PR · Tel/WhatsApp: `(43) 3027-4353`).
- **`/blinkmaringa`** (`https://domburiya.com.br/blinkmaringa`): Unidade Maringá (Av. Pedro Taques, 947 · Zona 07, Maringá/PR · Instagram: `@domburiyamaringa`).
- Todas as páginas BLINK contam com modais nativos acessíveis (`<dialog>`) de **Política de Privacidade (LGPD)** e **Termos de Uso**, banner de consentimento de cookies (`domburiya_blink_lgpd_v1`), cabeçalhos de segurança e links externos protegidos com `rel="noopener noreferrer"`.
