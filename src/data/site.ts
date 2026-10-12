/* O perfil e o contato (10/out/2026). Os textos são os do site
   vitordemantova.com (data/profile.ts, em inglês) e os canais, os de
   lib/constants.ts de lá: nada novo inventado aqui. */

export const SITE = {
  name: "Vitor Petri",
  /** o lugar e as coordenadas, no formato da tela de abertura:
      22°54′ S, 47°03′ W → "22.54.4703.39" (graus e minutos da latitude,
      graus e minutos da longitude, segundos) */
  place: "Campinas",
  coords: "22.54.4703.39",
  coordsTitle: "22°54′ S, 47°03′ W",
  email: "vpdemantova@gmail.com",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/vpdemantova/" },
    { label: "Behance", href: "https://www.behance.net/vitordemantova" },
    { label: "Dribbble", href: "https://dribbble.com/vpdemantova" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/vitor-demantova-a31b42193/" },
    { label: "X", href: "https://x.com/vpdemantova" },
    { label: "YouTube", href: "https://www.youtube.com/@vitordemantova" },
  ],
};

export const PROFILE = {
  /* o texto grande, à esquerda, em serifa */
  body: [
    "I am Vitor P. Demantova, from Campinas, Brazil. I work with music, design, photography and writing.",
    "I tune pianos, I am a luthier of string instruments, I compose for piano, chamber ensembles and orchestra, I conduct and I perform.",
    "I design logos, posters, interfaces and websites, from the drawing to the code. I photograph nature, activism, events and portraits, from the ground and from the air. I write criticism, philosophy and poems.",
  ],
  /* as duas linhas embaixo, à direita */
  aside: ["Signs that lift the soul:", "that is what I look for in all of it."],
  crafts: ["Music", "Design", "Photography", "Writing"],
};
