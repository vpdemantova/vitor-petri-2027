# Vitor Petri

O portfólio **Vitor Petri**, construído a partir das sete telas de referência do design "Whizbigg" (logotipo, Preloader, Home / Gallery, Project, Index e Profile), com o nome trocado e os projetos de verdade dele. Feito em 11/out/2026.

> **Este é um projeto à parte.** O "Portfólio do zero" (o repositório público em que o Vitor digita o código e a IA só orienta) continua sendo dele, com o guia em `blessednotebook/2 Academy/0 Aulas…/Portfólio do zero — guia e estatutos.md`. Este aqui foi construído inteiro pela IA, a pedido dele, e pode servir de referência.

## Rodar

```
npm install
npm run dev        # http://localhost:5190
npm run build      # confere os tipos e gera dist/
npm run preview    # serve o dist/ em http://localhost:5191
npm run images     # refaz as imagens de public/img a partir de media/
```

- `?webgl` no fim do endereço força o WebGL2. Serve para conferir o caminho de reserva num navegador que tem WebGPU.
- **Nada foi publicado.** Para pôr no ar:
  1. crie um repositório no GitHub e envie;
  2. na Vercel, crie um projeto ligado a ele, com o "Framework preset" **Vite**;
  3. comando de build `npm run build`, pasta `dist`.

## O que tem

| Tela de referência | Aqui |
|---|---|
| Logotipo | `VITOR PETRI` desenhado letra por letra no estilo do WHIZBIGG (`src/ui/wordmark.ts`) |
| Preloader | As coordenadas de Campinas e o logotipo grande, que se enche de baixo para cima enquanto as imagens chegam e depois voa até o canto |
| Home / Gallery | Os projetos como cartões em profundidade, no brilho lavanda; a etiqueta "Nome ↗ · VIEW PROJECT" presa ao canto do cartão da vez; o botão "Contact" |
| Project | O vidro claro com nome, ROLE / TYPE / STACK / YEAR, VISIT WEBSITE, a descrição e as imagens (as páginas inteiras) rolando |
| Index | O painel branco com os filtros (All, Websites, Design, Experiments) e a tabela. A linha sob o mouse leva a galeria até aquele projeto, à direita |
| Profile | O texto em serifa à esquerda, uma composição com três peças dele e as duas linhas embaixo à direita |
| Contact | A pílula vira o cartão "Get in touch!", com o e-mail e as redes |

Endereços: `#/index`, `#/profile` e `#/project/<id>` (o botão de voltar funciona, e um link leva direto a um projeto).

Teclado e acessibilidade:
- as setas (ou PageUp e PageDown) passam de projeto, e Enter abre o da vez;
- os painéis são diálogos: o Tab fica dentro, Esc fecha e o foco volta para onde estava;
- um leitor de tela ouve o nome do projeto da vez;
- com "reduzir movimento", nada dobra nem flutua.

## De onde saíram as medidas

As telas foram **medidas**, não copiadas a olho.

- **O logotipo.** As letras do WHIZBIGG foram lidas pixel a pixel numa imagem de 3840 × 2160. Na unidade em que a altura das letras vale 1000:
  - hastes de 174;
  - barras de 76;
  - miolos de uns 100;
  - cantos de fora de uns 110, com as curvas passando um pouco da linha;
  - o entalhe no meio do B;
  - espaço de uns 100 entre as letras.

  As letras que o WHIZBIGG não tem saem dessas regras:
  - V: as diagonais com a largura da diagonal do Z;
  - T: a barra do Z sobre a haste do I;
  - O: o G sem a abertura;
  - R: o B com a barriga de baixo aberta;
  - P: a barriga de cima do B;
  - E: a haste do B com três barras.
- **O brilho do fundo.** Medido em 41 pontos em cada eixo: é uma elipse que encosta nas quatro bordas da tela, e a cor cai em linha reta de `#878EE9` no centro até o preto na borda. Está igual no shader (`src/gl/backdrop.ts`) e no CSS por baixo, para a página nunca nascer preta.
- **As letras** (todas livres, do Google Fonts):
  - **Cormorant Garamond** no menu, nas coordenadas e no itálico das etiquetas;
  - **Young Serif** no texto do Perfil: foi a única candidata, entre oito comparadas lado a lado com a tela, com o "a" de um bojo só;
  - **Lato** no resto.
- **As distâncias.** Os quadros 16:9 foram levados a 1920 px de largura. Cada número no CSS é "px numa tela de 1920" (`calc(N * var(--u))`) e escala com a janela. Abaixo de 760 px, há outro jogo de medidas para o celular.

Diferenças em relação às telas:
- **Os nomes dos projetos são mais longos** que os das telas: no Índice, eles terminam em "…" e o nome inteiro aparece ao passar o mouse.
- **O Perfil:** onde a tela diz "Beautiful composition, images and texts here", entrou uma composição com três peças dele.
- **Projeto não publicado:** no lugar do link, aparece "Private" no Índice e "Not published yet" na ficha.

## As técnicas

- **WebGPU, com WebGL2 de reserva.** O `WebGPURenderer` do three.js escolhe o motor. Os materiais são escritos em **TSL** (a linguagem de nós do three), que vira WGSL no WebGPU e GLSL no WebGL2: o mesmo código nos dois.
- **A galeria** (`src/gl/gallery.ts`):
  - **a fila de cartões:** uma fila ao longo do eixo da câmera, sem fim. O cartão da vez fica no foco; os de trás ficam menores e mais escuros, em diagonais opostas;
  - **a rolagem:** persegue o alvo com uma **mola criticamente amortecida** (chega sem passar e sem tremer). Parada, ela **encaixa** no cartão mais perto;
  - **a velocidade:** entra nos shaders. O cartão **dobra** (os vértices se deslocam pela curva de um seno) e as cores **se separam** nas bordas (aberração cromática);
  - **a distância do foco depende da proporção da tela:** o cartão ocupa uns 57% da largura no computador e uns 84% no celular em pé.
- **Imagens fora da linha principal.** O `ImageBitmapLoader` decodifica com `createImageBitmap`, já na orientação que a GPU espera, com mipmaps e filtro anisotrópico.
- **Pontilhado (dithering)** no brilho: ±½ degrau de cor por pixel apaga os "degraus" que um degradê escuro faz em 8 bits.
- **Resolução adaptativa:** se o quadro passa de 20 ms por um segundo, a densidade de pixels baixa um degrau (até 1); com folga, sobe de volta. O laço para quando a aba some.
- **O 3D em pedaço separado:** a interface aparece na hora, e o three.js (uns 240 KB compactados) chega em seguida.
- **As animações da interface** são do GSAP:
  - o voo do logotipo, que mede onde ele está e para onde vai (FLIP);
  - o Índice que sobe;
  - o Perfil que se abre de dentro para fora;
  - o vidro da ficha;
  - a pílula do contato, que vira cartão;
  - o nome da etiqueta, que troca deslizando.

## Pôr um projeto

1. A imagem vai para `media/sites/` (uma captura de 1440 × 900, e a página inteira como `<nome>-full.jpg`, se quiser) ou para `media/design/` (o arquivo da peça).
2. `npm run images`.
3. Um item em `src/data/projects.ts`, com nome, categoria, tipo, função, tecnologias, ano, endereço, descrição, a imagem do cartão e as imagens da ficha. A ordem desse arquivo é a ordem da galeria e do índice.

**Regra: nada inventado.** Ano, função e tecnologias só entram quando são sabidos; o que falta fica vazio e a interface esconde o campo.

## Pastas

```
media/            as imagens originais (capturas e peças de design)
public/img/       as imagens do site, em WebP (geradas)
scripts/          prepare-images.mjs
src/main.ts       a página: abertura, etiqueta, contato, entradas, endereços
src/gl/           stage (renderizador), backdrop (o brilho), gallery (os cartões)
src/ui/           wordmark (o logotipo), panels (Índice, Perfil, Projeto), dom
src/data/         projects (os projetos), site (perfil e contato), image-sizes.json (gerado)
src/styles/       app.css
```
