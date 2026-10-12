/* ════════════════════════════════════════════════════════════════════
   OS PROJETOS (10/out/2026). Só trabalhos que existem: os sites e os
   experimentos foram fotografados no navegador (media/sites/), as peças
   de design são os arquivos do site vitordemantova.com (media/design/).
   Ano, função e tecnologias só onde são sabidos; o que falta fica vazio
   (a interface esconde o campo).

   Para pôr um projeto: a imagem em media/sites (ou media/design), rodar
   `npm run images` e acrescentar um item aqui. A ordem daqui é a ordem
   da galeria e do índice.
════════════════════════════════════════════════════════════════════ */
import sizes from "./image-sizes.json";

export type Category = "websites" | "design" | "experiments";

export interface Project {
  id: string;
  name: string;
  category: Category;
  /** o tipo, como no índice ("Personal website", "Poster"…) */
  type: string;
  role?: string;
  stack?: string;
  year?: string;
  /** o endereço público (sem ele, o botão diz que não está publicado) */
  url?: string;
  description: string;
  /** a textura do cartão na galeria */
  card: string;
  /** as imagens da ficha, de cima para baixo (páginas inteiras quando há) */
  shots: string[];
}

const SITE = "https://www.vitordemantova.com";

export const PROJECTS: Project[] = [
  {
    id: "vitordemantova",
    name: "Vitor P. Demantova",
    category: "websites",
    type: "Personal website",
    role: "Design & development",
    stack: "Next.js, React Three Fiber, GLSL",
    year: "2026",
    url: SITE,
    description:
      "My personal site, in two modes. The Studio: a 3D logo that breaks apart and rebuilds itself, a generative mosaic shader behind everything and a walkable 3D Laboratory. The Editorial: a magazine on houndstooth paper, with a mural for notes and drawings and a fountain-pen ink.",
    card: "vitordemantova",
    shots: ["vitordemantova-full", "editorial-full"],
  },
  {
    id: "laboratorio",
    name: "Laboratório",
    category: "experiments",
    type: "3D world",
    role: "Design & development",
    stack: "Three.js, React Three Fiber, WebGL",
    year: "2026",
    url: SITE,
    description:
      "A walkable world inside my site: a walled hall with the design and photography wings, a music workshop, a library, a minerals cabinet, a chemistry lab and a woodshop, under the real sky of Campinas. An isometric bird's-eye view and a map that teleports you to each door.",
    card: "laboratorio",
    shots: ["laboratorio", "laboratorio-passaro"],
  },
  {
    id: "dimensional-heritage",
    name: "Herança Dimensional",
    category: "design",
    type: "Geometric drawing",
    role: "Design",
    year: "2025",
    url: `${SITE}/design/dimensional-heritage`,
    description:
      "Nine squares and ten lines form seven triangles and one hexagon. Inside, three circles and six squares balance the drawing and give it depth.",
    card: "dimensional-heritage",
    shots: ["dimensional-heritage-full"],
  },
  {
    id: "editorial",
    name: "Editorial edition",
    category: "websites",
    type: "Magazine mode",
    role: "Design & development",
    stack: "Next.js, React Three Fiber",
    year: "2026",
    url: `${SITE}/?modo=editorial`,
    description:
      "The other face of the same site: a cover with a seal, a table of contents that becomes the logo, the sections laid out like a magazine, a houndstooth paper that turns red behind the pointer and a black lacquered 3D logo.",
    card: "editorial",
    shots: ["editorial-full"],
  },
  {
    id: "conservatorio-carlos-gomes",
    name: "Conservatório Carlos Gomes",
    category: "design",
    type: "Poster",
    role: "Design",
    url: `${SITE}/design/conservatorio-carlos-gomes`,
    description:
      "Poster built from concert photos of the conservatory: conductor, strings, choir and double bass, each photo in one tone, assembled into a single shape.",
    card: "poster-ccg",
    shots: ["poster-ccg-full"],
  },
  {
    id: "jardim",
    name: "Jardim 3D",
    category: "experiments",
    type: "Garden in 3D",
    role: "Design & development",
    stack: "Three.js, JavaScript",
    year: "2026",
    description:
      "My garden in 3D, with real plant species, under the real sky of Campinas: the Sun, the Moon and the planets computed from orbital elements and checked against known events.",
    card: "jardim",
    shots: ["jardim"],
  },
  {
    id: "primeiro-site",
    name: "Vitor Petri",
    category: "websites",
    type: "Portfolio",
    role: "Design & development",
    stack: "JavaScript, GSAP, anime.js, three.js",
    url: "https://vitorpetri.vercel.app",
    description:
      "My first portfolio: creative developer and designer, with filters for websites, digital art and experiments, and a three.js fog behind the type.",
    card: "primeiro-site",
    shots: ["primeiro-site"],
  },
  {
    id: "de-tanta-luz",
    name: "De tanta luz dói olhar pro sol",
    category: "design",
    type: "Type poster",
    role: "Design",
    url: `${SITE}/design/de-tanta-luz`,
    description:
      "Letters drawn with sun rays, in yellow and grey. The phrase means “so much light, it hurts to look at the sun”.",
    card: "sun-lettering",
    shots: ["sun-lettering-full"],
  },
  {
    id: "malha",
    name: "Malha",
    category: "experiments",
    type: "3D model viewer",
    role: "Design & development",
    stack: "React Three Fiber",
    year: "2026",
    url: SITE,
    description:
      "The 3D logo up close: turn it from every angle, see its faces, its wireframe of forty thousand triangles and its textures, with the logo explained.",
    card: "malha",
    shots: ["malha"],
  },
  {
    id: "cepil",
    name: "CEPIL",
    category: "design",
    type: "Visual identity",
    role: "Design",
    url: `${SITE}/design/cepil`,
    description:
      "Logo for CEPIL, a São Paulo center for innovation in public lighting, in its stacked version and its horizontal lockup.",
    card: "cepil-logo",
    shots: ["cepil-logo-full"],
  },
  {
    id: "materia-do-mundo",
    name: "Matéria do Mundo",
    category: "websites",
    type: "Atlas website",
    role: "Design & development",
    stack: "Next.js",
    year: "2026",
    description:
      "An atlas of what the world is made of: everything that exists is made of 118 elements. Here they are, and thirty things of the world, each one linked to the elements it is made of.",
    card: "materia-do-mundo",
    shots: ["materia-do-mundo"],
  },
  {
    id: "eufonia-abstrata",
    name: "Eufonia Abstrata",
    category: "design",
    type: "Zine",
    role: "Design",
    url: `${SITE}/design/eufonia-abstrata`,
    description: "Cover of a zine about Arnold Schoenberg.",
    card: "schoenberg-zine",
    shots: ["schoenberg-zine-full"],
  },
  {
    id: "notion",
    name: "VPD on Notion",
    category: "websites",
    type: "Portfolio",
    role: "Curation",
    stack: "Notion",
    url: "https://portalsolar.notion.site/VPD-494df162197444d1b7c2291118f82d21",
    description: "My earlier portfolio, organised in Notion by design, photo, video, music, text and architecture.",
    card: "notion",
    shots: ["notion"],
  },
  {
    id: "instituto-lenin",
    name: "Instituto Lênin",
    category: "design",
    type: "Study board",
    role: "Design",
    url: `${SITE}/design/instituto-lenin`,
    description:
      "A board on Ivan Leonidov’s 1927 proposal for the Lenin Institute of Librarianship in Moscow: purpose, program, materials and mechanization.",
    card: "lenin-leonidov",
    shots: ["lenin-leonidov-full"],
  },
];

export const CATEGORY_LABEL: Record<Category | "all", string> = {
  all: "All",
  websites: "Websites",
  design: "Design",
  experiments: "Experiments",
};

const SIZES = sizes as Record<string, { width: number; height: number }>;

/** Largura ÷ altura de uma imagem (pelo arquivo gerado). */
export function aspectOf(name: string): number {
  const s = SIZES[name];
  return s ? s.width / s.height : 16 / 10;
}

export const imageUrl = (name: string) => `${import.meta.env.BASE_URL}img/${name}.webp`;
