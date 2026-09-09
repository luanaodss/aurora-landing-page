# Aurora — Landing Page B2B (RH as a Service)

Landing page institucional desenvolvida para a Aurora, plataforma de RH as a Service, como projeto do Enterprise Challenge. O projeto tem como objetivo comunicar a proposta de valor B2B da Aurora e converter visitantes qualificados em leads, a partir da identidade de marca, do posicionamento e do conteúdo já publicados no site oficial da empresa ([aurorapro.com.br](https://aurorapro.com.br/)).

## Equipe

- Beatriz Zeferino da Fonseca — RM: (a confirmar)
- Luana Oliveira da Silva — RM: 571273

*(ordem alfabética por primeiro nome)*

## Acesso

- **Site publicado:** https://luanaodss.github.io/aurora-landing-page/
- **Repositório:** https://github.com/luanaodss/aurora-landing-page

## Como executar localmente

O CSS já vem compilado (`css/tailwind.css`), então basta abrir `index.html` no navegador ou servir a pasta com qualquer servidor estático, sem necessidade de build:

```bash
npx serve .
# ou
python3 -m http.server 8000
```

Um build só é necessário caso novas classes utilitárias do Tailwind sejam adicionadas ao HTML:

```bash
npm install
npm run build:css
```

## Estrutura de pastas

```
/aurora-landing-page
  /assets/images       → logo oficial e imagens de produto
  /css
    tailwind.css       → CSS compilado (commitado — abrir o site não exige build)
  /js
    script.js          → interações: menu, diagnóstico interativo, formulário
  /src
    input.css          → fonte do Tailwind (tokens de marca e componentes)
  tailwind.config.js    → tokens de marca mapeados para o Tailwind
  index.html
  README.md
```

## Tecnologias utilizadas

- **HTML5 semântico**, com landmarks (`header`, `nav`, `main`, `section`, `footer`) e hierarquia correta de headings.
- **Tailwind CSS**, compilado via CLI standalone (sem bundler adicional), com os tokens de marca (cores, tipografia, espaçamento) configurados em `tailwind.config.js` para garantir consistência visual em toda a página.
- **JavaScript vanilla**, sem frameworks, responsável pelo menu de navegação, pelo diagnóstico interativo e pelo envio do formulário de contato.
- **Lucide Icons**, implementados como SVG inline, o que evita dependência de um runtime JavaScript apenas para exibir ícones, favorecendo desempenho e compatibilidade com leitores de tela.

## Identidade visual

A paleta de cores, a tipografia e o tom de voz seguem as diretrizes de marca da Aurora.

| Uso | Cor | Hex | Classe Tailwind |
|---|---|---|---|
| Primária | Violeta | `#6a509d` | `violet` |
| Primária (hover/escura) | Violeta escuro | `#574185` | `violet-dark` |
| Destaque | Rosa | `#cf4793` | `rosa` |
| Suporte | Lilás | `#7e61a7` | `lilac` |
| Acento pontual | Teal | `#31b4a6` | `teal` |
| Texto principal | Tinta | `#1b1733` | `ink` |
| Texto de corpo | — | `#4b4763` | `body` |

Tipografia: **Outfit**, em múltiplos pesos, para títulos e corpo de texto, via Google Fonts, conforme as diretrizes de identidade visual da marca.

## Arquitetura de informação

A página segue a sequência: **Header (navegação fixa) → Hero → O Problema → Diagnóstico Rápido → A Solução → RH as a Service → Como Funciona (Motor de Inteligência) → Depoimentos → Planos → Formulário de Contato → Rodapé.**

Essa ordem foi definida para resolver uma ambiguidade de narrativa presente no material institucional original, que apresentava a proposta da plataforma, a tecnologia de IA e a dor do desligamento sem uma hierarquia clara entre os três eixos. A estrutura adotada abre com a tensão emocional real por trás de decisões sobre pessoas, convida o visitante a se autoavaliar por meio do diagnóstico interativo, apresenta a amplitude do produto, demonstra a plataforma em uso e conclui com a resolução por meio de inteligência artificial (Chatbot Boreal), fechando com uma chamada objetiva para contato.

O Hero utiliza uma captura de tela real da plataforma (painel do gestor), reforçando a autenticidade do produto perante um mockup ilustrado. A seção "A Solução" apresenta o conteúdo institucional em duas colunas, com as fundadoras destacadas como cards de foto vinculados aos respectivos perfis profissionais. A seção "RH as a Service" utiliza uma navegação por clusters temáticos (chips clicáveis), permitindo acesso direto a qualquer grupo de módulos sem alterar o conteúdo original da marca.

Não foram criados dados fictícios em nenhuma parte do projeto: números, funcionalidades e depoimentos correspondem ao que está publicado no site institucional da Aurora.

## Elemento disruptivo: diagnóstico interativo

O diferencial competitivo da página é um **diagnóstico rápido de três perguntas**, executado inteiramente no navegador (sem backend), posicionado logo após a seção "O Problema". A ferramenta avalia dois eixos de maturidade da empresa visitante, a maturidade do processo de decisão sobre pessoas e a maturidade da consolidação de dados de RH, classificando o resultado em cinco perfis distintos. Cada perfil recomenda módulos reais e nomeados da plataforma Aurora, e cada recomendação é um link que rola a página até o card correspondente na seção "RH as a Service", destacando-o visualmente.

| Perfil | Eixo mais fraco | Módulos recomendados |
|---|---|---|
| Decisões no escuro | ambos | Radar de Experiência + Ciclo de Performance |
| Dados sem direção | processo de decisão | Chatbot Boreal + Planos de Ação |
| Faltam dados para sustentar | consolidação de dados | Radar de Experiência + Pesquisas Customizáveis |
| Meio caminho andado | nenhum (empate) | Feedbacks Contínuos + Avaliação de Valores |
| Prontos para escalar | nenhum (ambos altos) | Chatbot Boreal + Planos de Ação |

A escolha por essa abordagem, em vez de uma visualização animada do motor de inteligência ou de um slider comparativo "antes/depois", justifica-se por unir três objetivos ao mesmo tempo: reforçar a proposta de valor da marca (decisões orientadas por dados), gerar engajamento genuíno do visitante e qualificar o lead antes mesmo do preenchimento do formulário de contato (progressive profiling), já que o porte da empresa informado no diagnóstico pré-preenche o campo correspondente no formulário.

## Formulário de captação de leads

O formulário de contato realiza envio real dos dados para um serviço de gerenciamento de formulários (Formspree), com as seguintes características:

- Funciona mesmo sem JavaScript habilitado, por meio de um envio HTTP tradicional (`action`/`method` do próprio `<form>`), garantindo que a captação de lead nunca dependa exclusivamente de script.
- Com JavaScript habilitado, o envio é interceptado e realizado de forma assíncrona, mantendo o usuário na mesma página e exibindo mensagens de sucesso ou erro específicas para cada situação.
- O botão de envio é desabilitado durante o processamento, evitando envios duplicados.
- Um campo honeypot (invisível e fora da navegação por teclado) descarta silenciosamente submissões automatizadas, sem impacto para usuários reais ou para quem utiliza leitor de tela.
- Todos os campos possuem validação client-side com mensagens de erro específicas, associadas ao campo correspondente.

## Recursos de acessibilidade

O projeto segue as diretrizes WCAG 2.1, nível AA, como requisito desde a concepção da interface, e não como uma revisão posterior:

- **HTML semântico**, com um único `h1` por página, hierarquia correta de `h2`/`h3`, e uso de `header`, `nav`, `main`, `section`, `blockquote`/`cite`, `fieldset`/`legend` e `footer`.
- **Skip link** como primeiro elemento focável da página, permitindo pular diretamente para o conteúdo principal.
- **Foco visível** em todos os elementos interativos, com contorno customizado que respeita a identidade visual da marca, nunca suprimido via CSS.
- **Navegação completa por teclado**, incluindo o menu mobile (controlado por elemento nativo `button`, com `aria-expanded`/`aria-controls`, fechamento via tecla Esc) e âncoras internas ajustadas para não ficarem ocultas atrás do cabeçalho fixo.
- **Diagnóstico interativo acessível**: cada pergunta utiliza `fieldset`/`legend` com campos `radio` nativos, navegação por teclado nativa, movimento de foco programático entre etapas e validação com mensagens de erro anunciadas via `role="alert"`.
- **Formulário acessível**: rótulos associados a cada campo, indicação textual de obrigatoriedade (não apenas por cor), mensagens de erro com `role="alert"` e `aria-describedby`, e mensagem de sucesso com `role="status"`.
- **Contraste de texto validado em toda a página**, incluindo elementos sobre fundos com gradiente e semitransparência, atingindo no mínimo a razão de contraste 4,5:1 exigida pela WCAG AA para texto normal, com folga confirmada por amostragem em múltiplas larguras de tela.
- **Áreas de toque** com altura mínima de 44px em botões e campos interativos.
- **Suporte a `prefers-reduced-motion`**, desativando transições, rolagem suave e animações decorativas para usuários que configuraram redução de movimento no sistema operacional.
- **Textos alternativos** descritivos em imagens de conteúdo real (como a captura de tela da plataforma no Hero) e `aria-hidden` em elementos puramente decorativos, evitando ruído para quem utiliza leitor de tela.
- **Vitrine de depoimentos acessível**: todos os depoimentos permanecem no HTML e são lidos em ordem por leitores de tela, independentemente da posição do scroll horizontal; navegação disponível por arraste, teclado (setas) e botões dedicados, sem movimento automático (o que dispensaria a necessidade de controle de pausa exigido pela WCAG quando há conteúdo em movimento automático).
- **Links externos identificados**: links que abrem em nova aba avisam essa mudança de contexto no próprio rótulo acessível.

## Alinhamento com as diretrizes de marca

A identidade visual, o tom de voz e o estilo de iconografia foram validados diretamente contra as diretrizes oficiais de marca fornecidas pela Aurora, com o seguinte resultado:

| Diretriz | Situação |
|---|---|
| Paleta de cores (4 tokens) | Em conformidade |
| Estilo de ícone (line/minimalista) | Em conformidade |
| Tom de voz institucional | Em conformidade |
| Tipografia (família única, múltiplos pesos) | Em conformidade |
| Mockup real da plataforma no Hero | Implementado |
| Prova social (depoimentos e logos de clientes) | A Aurora encontra-se em fase pré-lançamento, sem clientes confirmados publicamente; por isso, o projeto utiliza exclusivamente os depoimentos reais já publicados no site institucional, sem inclusão de dados fictícios |

A decisão de não incluir clientes, logos ou depoimentos fictícios reflete o princípio de integridade dos dados adotado no projeto: toda informação apresentada corresponde ao que está publicado oficialmente pela Aurora.
