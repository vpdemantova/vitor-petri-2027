# Vitor Petri — tarefas, prompts, controles e melhorias

> O painel de trabalho deste projeto. Você acrescenta, eu faço (ou guio), e os dois vamos riscando. Criado em 11/out/2026. O que já existe e como roda está no `README.md`; aqui fica o que vem depois.

## Como usar

- **Para pedir uma tarefa, diga o número:** "faz a VP-12", "faz as VP-20 a VP-24", "faz todas as P1 de Design". O prompt pronto de cada uma está logo abaixo dela; dá para copiar e mudar.
- **Para acrescentar uma ideia:** uma linha na categoria certa, com o próximo número livre (o último em uso está no fim da página). Pode ser em português corrido, do seu jeito; eu completo o porquê e o prompt quando for fazer.
- **Situação de cada uma:**
  - `[ ]` a fazer;
  - `[~]` em andamento;
  - `[x]` feita (com a data);
  - `[-]` descartada (com o motivo).
- **Prioridade:** **P1** faz diferença já, **P2** melhora bem, **P3** quando der.
- **Tamanho:** *pequena* (minutos), *média* (uma sessão), *grande* (várias sessões, ou precisa de decisão sua).
- Quando uma tarefa fica pronta, ela ganha `[x]` e uma linha no **Registro**, no fim.

---

## 1. Controles

### Comandos
| O quê | Comando | Onde |
|---|---|---|
| Rodar no computador | `npm run dev` | http://localhost:5190 |
| Testar o WebGL2 (sem WebGPU) | o mesmo, com `?webgl` | http://localhost:5190/?webgl |
| Conferir os tipos | `npm run typecheck` | |
| Gerar a versão final | `npm run build` | sai em `dist/` |
| Ver a versão final | `npm run preview` | http://localhost:5191 |
| Refazer as imagens | `npm run images` | lê `media/`, grava `public/img/` |
| Ver no celular, na mesma rede | `npx vite --host` | o endereço "Network" que aparecer |

### Antes de dar uma tarefa por pronta
- [ ] `npm run build` sem erro (ele já confere os tipos).
- [ ] Olhar em **1440 px** e em **390 px** (F12 → modo dispositivo), sem rolagem para os lados.
- [ ] Olhar com `?webgl` (o caminho de quem não tem WebGPU).
- [ ] Só pelo teclado: Tab, setas, Enter e Esc fazem tudo.
- [ ] Com **reduzir movimento** ligado (Windows: Configurações › Acessibilidade › Efeitos visuais › Efeitos de animação), nada dobra nem flutua.
- [ ] Console do navegador sem erro vermelho.
- [ ] Nada inventado: ano, função e tecnologia só se forem sabidos.

### O que não fazer
- Publicar (push, deploy) sem você pedir.
- Inventar dado de projeto.
- Mexer no **Portfólio do zero**, que é seu: a IA só guia lá.

---

## 2. Conteúdo

- [ ] **VP-01** · [P1 · pequena] **Descrições em português.** O site está todo em inglês, como as telas. A ideia é um botão PT/EN no menu, com os textos dos projetos e do Perfil nas duas línguas, e a troca de idioma animada do vitordemantova.com.
  *Prompt:* "faz a VP-01: PT/EN no Vitor Petri, com os textos dos projetos e do perfil nas duas línguas e a troca animada."
- [ ] **VP-02** · [P1 · pequena] **Sua foto no Perfil.** A tela pede "composição, imagens e textos"; hoje são três peças de design. Uma foto sua (ou de você tocando, ou na oficina) dá rosto ao perfil. *Preciso da foto.*
  *Prompt:* "faz a VP-02 com esta foto: [anexo]."
- [ ] **VP-03** · [P2 · média] **Categoria Música.** Você é músico e o site não tem música. Uma quarta categoria, com as composições (a Chanson Antique já tem gravação) e um cartão que toca ao passar o mouse.
  *Prompt:* "faz a VP-03: categoria Music com as composições do vitordemantova e o cartão que toca."
- [ ] **VP-04** · [P2 · pequena] **Anos que faltam.** CEPIL, Conservatório, De tanta luz, Eufonia, Instituto Lênin, o primeiro site e o Notion estão sem ano. *Você me diz os anos e eu ponho.*
- [ ] **VP-05** · [P2 · média] **Mais projetos de verdade.** Candidatos: o bhop-surf (o jogo), a Casa 3D (sem dados pessoais à vista), o Portal Solar e as fotografias (quando houver).
  *Prompt:* "faz a VP-05 com: [lista]."
- [ ] **VP-06** · [P3 · pequena] **WhatsApp no contato**, como no vitordemantova.com.
- [ ] **VP-07** · [P2 · média] **Vídeo no lugar da foto nos sites.** Um laço de 6 a 10 s de cada site (gravado do navegador) em vez da imagem parada. Ver a VP-33.

## 3. Design e interface (fidelidade às telas)

- [ ] **VP-10** · [P1 · média] **Modo comparação.** `?ref=2` põe a tela de referência 2 por cima do site, meio transparente, para conferir medida por medida. É a ferramenta para chegar a 100% de fidelidade.
  *Sugestão de código* (em `main.ts`):
  ```ts
  const ref = new URLSearchParams(location.search).get("ref");
  if (ref) document.body.append(Object.assign(document.createElement("img"), {
    src: `/ref/${ref}.png`,   // as telas de referência em public/ref/
    style: "position:fixed;inset:0;width:100%;height:100%;object-fit:cover;opacity:.5;pointer-events:none;z-index:99;mix-blend-mode:difference",
  }));
  ```
  Com `mix-blend-mode: difference`, o que coincide fica preto e o que está fora de lugar acende.
- [ ] **VP-11** · [P1 · pequena] **Contraste dos cinzas.** O cinza claro dos valores (ROLE, TYPE…) e do "Private" mede **2,17:1** sobre o vidro e **2,72:1** sobre o branco; o mínimo para ler (AA) é 4,5:1.
  *Sugestão:* `--muted: #5f5f6b` dá 5,0:1 no vidro, e `#6b6b77` dá 5,3:1 no branco. Mantém o ar claro da tela e passa a ser legível.
- [ ] **VP-12** · [P2 · pequena] **Cantos dos cartões.** Nas telas, os cartões têm canto vivo. Se quiser um raio mínimo (como janelas de navegador), dá para fazer no shader, sem perder a dobra:
  ```ts
  // gallery.ts, no material do cartão; uSize = (largura, altura) do cartão em metros
  const p = uv().sub(0.5).mul(uSize);
  const r = float(0.035);
  const q = abs(p).sub(uSize.mul(0.5)).add(r);
  const d = length(max(q, 0)).add(min(max(q.x, q.y), 0)).sub(r); // distância até a borda arredondada
  mat.opacityNode = u.alpha.mul(smoothstep(fwidth(d), fwidth(d).negate(), d));
  ```
- [ ] **VP-13** · [P2 · pequena] **Contador "03 / 14"** discreto, no pé à direita (Cormorant, como as coordenadas). Diz onde você está na fila.
- [ ] **VP-14** · [P2 · média] **A abertura com mais assinatura.** Hoje o logotipo se enche de baixo para cima. Ideias:
  - as letras chegam uma a uma, cada haste caindo no lugar;
  - as coordenadas "digitam";
  - o brilho acende do centro.
- [ ] **VP-15** · [P2 · pequena] **Cursor próprio.** Um círculo branco que vira "VIEW" sobre o cartão da vez, e uma seta sobre os outros.
- [ ] **VP-16** · [P3 · pequena] **Favicon e imagem de compartilhamento** com o logotipo VITOR PETRI no brilho lavanda (1200 × 630, gerada pelo script de imagens a partir do SVG). Ver a VP-60.
- [ ] **VP-17** · [P3 · média] **A cor do brilho pela hora.** O lavanda vale de dia, mais quente ao pôr do sol e mais fundo à noite, pela hora de Campinas. Discreto, sem perder a cor das telas.

## 4. Experiência (UX)

- [ ] **VP-20** · [P1 · média] **Os filtros do Índice mexem na galeria.** Hoje eles só filtram a lista. Com "Design", a fila 3D passa a ter só as peças de design.
  *Sugestão:* `gallery.setFilter(cat)`, que refaz a ordem só com os visíveis (o `index` de cada cartão vira a posição na lista filtrada) e deixa os outros invisíveis com alpha 0, numa transição.
- [ ] **VP-21** · [P1 · pequena] **Anterior / próximo na ficha do projeto:** ← e → no teclado e dois botões no pé, para ver os projetos sem fechar.
  *Prompt:* "faz a VP-21."
- [ ] **VP-22** · [P2 · média] **Do cartão para a ficha, sem corte.** Ao abrir, a ficha nasce do retângulo do cartão na tela (os 4 cantos projetados) e cresce até o lugar dela (FLIP), enquanto o cartão 3D some. Ao fechar, o caminho de volta.
- [ ] **VP-23** · [P2 · pequena] **Dica de rolagem** na primeira visita: "scroll / drag", que some no primeiro movimento.
- [ ] **VP-24** · [P2 · pequena] **Ajuste fino do arrasto no celular** (força, embalo, encaixe), testado num aparelho de verdade. *Preciso que você teste e me diga como sentiu.*
- [ ] **VP-25** · [P3 · pequena] **Atalhos à vista:** "?" abre uma lista pequena (← → mudar, Enter abrir, I índice, P perfil, Esc fechar).
- [ ] **VP-26** · [P3 · média] **Busca no Índice:** digitar filtra por nome, tipo ou tecnologia.

## 5. 3D e WebGPU

- [ ] **VP-30** · [P2 · média] **Pós-processamento leve em TSL:** um brilho suave (bloom) e grão de filme bem fino, só na galeria. O three já traz `BloomNode` e `FilmNode` em `three/examples/jsm/tsl/display/`, usados com `new THREE.PostProcessing(renderer)` e `pass(scene, camera)`. Com "reduzir movimento", sem grão animado.
- [ ] **VP-31** · [P2 · média] **A troca de cartão como onda.** Ao encaixar no próximo, a imagem do cartão se distorce num deslocamento radial que sai do centro e assenta (no colorNode, pela distância ao centro e o tempo da troca).
- [ ] **VP-32** · [P2 · grande] **Partículas em computação na GPU** (só WebGPU, com reserva no WebGL2): na abertura, milhares de pontos formam o logotipo VITOR PETRI e se desfazem no brilho. Base: o exemplo `webgpu_compute_particles` do three, com um `Fn(...)().compute(n)`.
- [ ] **VP-33** · [P2 · média] **Texturas de vídeo** nos sites (`THREE.VideoTexture` com `muted`, `loop`, `playsInline`): só o cartão da vez toca, os outros ficam no primeiro quadro (economia).
- [ ] **VP-34** · [P3 · média] **Profundidade de campo:** os cartões de trás um pouco desfocados (mipmap mais alto ou um desfoque em TSL), o da vez nítido.
- [ ] **VP-35** · [P3 · pequena] **Inclinação do cartão da vez seguindo o mouse** (até 4°), como um objeto na mão.

## 6. Desempenho

- [ ] **VP-40** · [P1 · pequena] **Só o alfabeto latino nas fontes.** Hoje vão junto o cirílico e o vietnamita (o navegador só baixa o que usa, mas o build fica maior).
  *Sugestão:* trocar `@import "@fontsource/lato/400.css"` por `@import "@fontsource/lato/latin-400.css"`, e o mesmo nas outras.
- [ ] **VP-41** · [P2 · média] **Texturas KTX2** (comprimidas na GPU): menos memória e decodificação instantânea, bom para celular. Gerar com o `toktx` a partir de `media/` e carregar com o `KTX2Loader` (conferir na documentação o uso com o `WebGPURenderer`).
- [ ] **VP-42** · [P2 · pequena] **Medir:** Lighthouse no modo anônimo do Edge (meta: 95 ou mais em tudo) e o tempo até o primeiro cartão aparecer.
- [ ] **VP-43** · [P3 · pequena] **Ver o que pesa no pacote** (`rollup-plugin-visualizer`). Hoje o three com WebGPU tem 240 KB compactado e é a maior parte.
- [ ] **VP-44** · [P3 · pequena] **Carregar primeiro as 3 imagens perto da vez** e depois as outras (hoje as 14 vão juntas).

## 7. Acessibilidade

- [ ] **VP-50** · [P1 · pequena] Os contrastes da VP-11.
- [ ] **VP-51** · [P2 · pequena] **Link "pular para o índice"** no começo da página, visível com o Tab: quem não vê a galeria vai direto para a lista.
- [ ] **VP-52** · [P2 · pequena] **Alvos de toque de 44 px** no celular: conferir o fechar, os filtros e os links "Visit".
- [ ] **VP-53** · [P3 · pequena] **Revisão com leitor de tela** (o Narrador do Windows: Ctrl + Win + Enter), de ponta a ponta.

## 8. SEO e compartilhamento

- [ ] **VP-60** · [P1 · média] **Imagem e textos de prévia** (Open Graph): quando o link vai no WhatsApp, aparece o logotipo no brilho, o nome e uma frase.
- [ ] **VP-61** · [P2 · média] **Cada projeto com o seu endereço "de verdade"** (`/project/laboratorio` em vez de `#/project/laboratorio`) e uma página gerada no build com o título e a prévia daquele projeto, para a busca e o compartilhamento.
- [ ] **VP-62** · [P3 · pequena] **Dados estruturados "Person"** (nome, ofícios, redes) para a busca.

## 9. Código e organização

- [ ] **VP-70** · [P2 · pequena] **ESLint e Prettier**, com `npm run lint` no controle de antes do pronto.
- [ ] **VP-71** · [P2 · média] **Testes (Vitest)** do que é conta pura: a largura do logotipo, a volta da fila (`wrap`), o encaixe e o caminho mais curto do `goTo`. Para isso, essas funções saem para `src/gl/math.ts`.
- [ ] **VP-72** · [P2 · pequena] **Dividir o `main.ts`** (hoje ~290 linhas): `ui/label.ts`, `ui/contact.ts`, `ui/intro.ts`, `core/router.ts`, `core/input.ts`.
- [ ] **VP-73** · [P3 · média] **Conteúdo em Markdown:** cada projeto um `.md` em `content/` (como a Escrita do vitordemantova), lido no build. Acrescentar um projeto deixa de ser mexer em código.
- [ ] **VP-74** · [P3 · pequena] **GitHub Actions:** build e tipos a cada envio.

## 10. Publicação

- [ ] **VP-80** · [P1 · pequena] **Git:** `git init`, o primeiro commit e um repositório no GitHub. *Só com o seu "pode".*
- [ ] **VP-81** · [P1 · pequena] **No ar pela Vercel** (preset Vite, build `npm run build`, pasta `dist`). *Só com o seu "pode".*
- [ ] **VP-82** · [P2 · pequena] **Domínio:** `vitorpetri.com` ou um subdomínio de `vitordemantova.com`? *Decisão sua.*
- [ ] **VP-83** · [P3 · pequena] **Cache longo** para `/img` e `/assets` (os nomes já mudam a cada versão), num `vercel.json`.

## 11. Ideias grandes (para pensar junto)

- **VP-90 · O site como instrumento.** Cada cartão com uma nota; rolar a galeria toca um arpejo, e a velocidade muda o andamento. Música e design no mesmo gesto. Com som desligado por padrão e um botão para ligar.
- **VP-91 · Um modo "sala".** Com uma tecla, a fila vira uma galeria de verdade (paredes, chão, luz) por onde se anda, como o Laboratório do vitordemantova.
- **VP-92 · Estudo de caso por projeto.** A ficha ganha uma segunda parte com o processo: esboços, decisões, antes e depois.
- **VP-93 · As cores de cada projeto.** O brilho do fundo puxa de leve para a cor dominante do cartão da vez (calculada da imagem no build).

---

## 12. Prompts prontos

**Refinar a fidelidade de uma tela:**
> "Compara a tela [número] com o site no modo comparação (VP-10) e acerta tudo que estiver fora: medidas, letras, cores, espaçamentos. Mostra o antes e o depois."

**Uma rodada de qualidade:**
> "Rodada de qualidade no Vitor Petri: contraste, teclado, leitor de tela, Lighthouse, celular. Lista o que achou, corrige o que for P1 e registra aqui."

**Um projeto novo na galeria:**
> "Põe no Vitor Petri o projeto [nome]: [endereço ou imagens], categoria [Websites/Design/Experiments], tipo [ ], função [ ], tecnologias [ ], ano [ ], descrição [ ]."

**Publicar:**
> "Pode publicar o Vitor Petri: git, GitHub [público ou privado] e Vercel."

---

## 13. Registro

| Data | O que | Onde |
|---|---|---|
| 11/out/2026 | O projeto nasce das 7 telas do Whizbigg: logotipo medido e redesenhado, brilho medido, galeria 3D em WebGPU (com WebGL2 de reserva), abertura, Índice, Perfil, ficha, contato, 14 projetos reais. Testado em 1440 e 390, nos dois motores. | `README.md` |
| 11/out/2026 | Este arquivo de tarefas. | `TAREFAS.md` |

*Último número em uso: VP-93. O próximo é VP-94 (ou o primeiro número livre da categoria).*
