/* ════════════════════════════════════════════════════════════════════
   A GALERIA: os projetos como cartões em profundidade (a tela "Home /
   Gallery" das referências).

   A ideia: uma fila de cartões ao longo do eixo da câmera, separados por
   D metros. A rolagem (roda, dedo, setas) anda por essa fila; o cartão da
   vez fica a FOCUS metros da câmera, no meio da tela. Os de trás ficam
   menores e mais escuros, espalhados pelos quatro cantos (como nas
   telas: um em cima à direita, outro embaixo à esquerda…); o que passa
   da vez cresce, sai pelo lado e some atrás da câmera. A fila não tem fim
   (dá a volta).

   A física da rolagem:
   · a entrada soma no alvo; a posição persegue o alvo com uma mola
     criticamente amortecida (chega sem passar e sem tremer);
   · parada, a rolagem encaixa no cartão mais perto (o "ímã");
   · a velocidade entra nos shaders: o cartão dobra (curva na largura) e as
     cores se separam um pouco nas bordas (aberração cromática), e voltam
     ao normal quando para. Com "reduzir movimento", nada dobra.

   Os materiais são escritos em TSL (three/tsl) e rodam em WebGPU ou WebGL2.
════════════════════════════════════════════════════════════════════ */
import * as THREE from "three/webgpu";
import { Fn, uniform, texture, uv, vec2, vec3, vec4, float, sin, positionLocal, clamp, mix, abs } from "three/tsl";
import { PROJECTS, aspectOf, imageUrl, type Project } from "../data/projects";

export const D = 1.3;        // metros entre um cartão e o próximo (o de trás fica com ~75% do tamanho, como nas telas)
export const FOCUS = 3.35;   // a distância do cartão da vez até a câmera
const SITE_W = 2.0;          // a largura de um cartão de site (16:10)
const ART_H = 1.42;          // a altura máxima de uma peça de design (em pé)

/* para onde cada cartão "foge" quando não é a vez dele (x, y em metros) —
   o desenho das telas: em cima à direita, embaixo à esquerda… */
const SPREAD: [number, number][] = [
  /* em cima à direita e embaixo à esquerda, alternando (com 14 cartões, a
     alternância segue na volta da fila): o de trás e o seguinte ficam
     sempre em diagonais opostas, como nas telas (+0,8/+0,5 e −0,7/−0,5) */
  [0.86, 0.5], [-0.78, -0.5], [0.98, 0.36], [-0.9, -0.38], [0.72, 0.6], [-0.66, -0.6], [0.94, 0.48], [-0.84, -0.46],
];

const makeUniforms = () => ({ vel: uniform(0), hover: uniform(0), alpha: uniform(0), dim: uniform(0), reveal: uniform(0) });
type Uniforms = ReturnType<typeof makeUniforms>;

interface Card {
  project: Project;
  index: number;
  mesh: THREE.Mesh;
  w: number;
  h: number;
  spread: [number, number];
  u: Uniforms;
  hover: number;
  rel: number;
}

export interface Gallery {
  update: (dt: number) => void;
  /** a entrada: soma (em "cartões") ao alvo */
  nudge: (cards: number) => void;
  /** vai até o projeto i pelo caminho mais curto */
  goTo: (index: number) => void;
  /** em que cartão o ponteiro está (coordenadas −1…1), ou null */
  pick: (ndcX: number, ndcY: number) => number | null;
  setHover: (index: number | null) => void;
  /** o projeto da vez e o quão perto do foco ele está (0 longe … 1 no foco) */
  active: () => { index: number; focus: number };
  /** o canto de baixo à direita do cartão da vez, em pixels da tela */
  anchor: (out: { x: number; y: number }) => boolean;
  /** a abertura: os cartões chegam do fundo (0 → 1) */
  setReveal: (v: number) => void;
  setPointer: (x: number, y: number) => void;
  /** carrega as texturas; avisa o progresso (0…1) */
  load: (onProgress: (p: number) => void) => Promise<void>;
}

export function createGallery(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGPURenderer, reduced: boolean): Gallery {
  const N = PROJECTS.length;
  const L = N * D;
  const group = new THREE.Group();
  scene.add(group);
  /* uma malha só para todos: um plano 1 × 1 com divisões (para dobrar) */
  const geometry = new THREE.PlaneGeometry(1, 1, 32, 18);
  const placeholder = new THREE.Texture();

  const cards: Card[] = PROJECTS.map((project, index) => {
    const ar = aspectOf(project.card);
    const isArt = project.category === "design";
    let w = SITE_W, h = SITE_W / ar;
    if (isArt) { h = Math.min(ART_H, SITE_W / ar); w = h * ar; if (w > SITE_W) { w = SITE_W; h = w / ar; } }
    const u = makeUniforms();
    const mat = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide });
    const map = texture(placeholder);
    /* a dobra: a curva no meio da largura, pela velocidade; e, na
       abertura, o cartão chega levemente curvado */
    mat.positionNode = Fn(() => {
      const p = positionLocal.toVar();
      const q = uv();
      const bend = sin(q.x.mul(Math.PI)).mul(u.vel).mul(0.32).add(sin(q.y.mul(Math.PI)).mul(u.vel).mul(0.08));
      p.z.addAssign(bend.add(sin(q.x.mul(Math.PI)).mul(float(1).sub(u.reveal)).mul(-0.6)));
      return p;
    })();
    /* a imagem: um pouco ampliada sob o mouse, e as cores separadas nas
       bordas conforme a velocidade */
    mat.colorNode = Fn(() => {
      const q = uv().sub(0.5).mul(float(1).sub(u.hover.mul(0.045))).add(0.5).toVar();
      const edge = abs(q.x.sub(0.5)).mul(2);
      const shift = vec2(clamp(u.vel, -1, 1).mul(0.012).mul(edge.add(0.25)), 0);
      const r = map.sample(q.add(shift)).r;
      const g = map.sample(q).g;
      const b = map.sample(q.sub(shift)).b;
      const c = vec3(r, g, b).toVar();
      /* longe, mais escuro (como os cartões de trás nas telas) */
      return vec4(mix(c, vec3(0.02, 0.02, 0.05), u.dim), 1);
    })();
    mat.opacityNode = u.alpha;
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.scale.set(w, h, 1);
    mesh.userData.index = index;
    mesh.userData.map = map;
    group.add(mesh);
    return { project, index, mesh, w, h, spread: SPREAD[index % SPREAD.length], u, hover: 0, rel: 0 };
  });

  /* ── a rolagem ── */
  let target = 0, pos = 0, vel = 0, idle = 0, reveal = 0;
  const pointer = new THREE.Vector2();
  const camGoal = new THREE.Vector3();
  let hovered: number | null = null;

  const wrap = (r: number) => {
    let v = ((r % L) + L) % L;
    if (v > L - 1.5 * D) v -= L;      // os que já passaram ficam do lado de cá
    return v;
  };

  /* a distância do foco depende da proporção da tela: o cartão da vez
     ocupa ~57% da largura no computador (como nas telas) e ~84% num
     celular em pé. Tudo (fila, espalhamento, câmera) escala junto. */
  let k = 1, portrait = false;
  const fit = () => {
    const aspect = camera.aspect || 1.6;
    portrait = aspect < 0.9;
    const want = SITE_W / ((portrait ? 0.84 : 0.57) * 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect);
    k = Math.max(1, want / FOCUS);
  };

  const update = (dt: number) => {
    fit();
    /* o ímã: parado, encaixa no cartão mais perto */
    idle += dt;
    if (idle > 0.18) target += (Math.round(target) - target) * (1 - Math.exp(-dt * 7));
    /* mola criticamente amortecida até o alvo (em "cartões") */
    const stiff = 46, damp = 2 * Math.sqrt(stiff);
    const acc = (target - pos) * stiff - vel * damp;
    vel += acc * dt;
    pos += vel * dt;
    const speed = reduced ? 0 : THREE.MathUtils.clamp(vel * 0.32, -1, 1);

    /* a câmera: um pouco de paralaxe com o mouse, sempre olhando o foco */
    camGoal.set(pointer.x * (reduced ? 0 : 0.22) * k, pointer.y * (reduced ? 0 : 0.14) * k, 0);
    camera.position.lerp(camGoal, 1 - Math.exp(-dt * 3.5));
    camera.lookAt(0, 0, -FOCUS * k);

    const S = pos * D;
    for (const card of cards) {
      const rel = wrap(card.index * D - S);
      card.rel = rel;
      const away = smoothstepJS(0, D * 0.95, Math.abs(rel));
      /* a abertura: os cartões vêm do fundo, um depois do outro */
      const rv = THREE.MathUtils.clamp(reveal * 1.6 - card.index * 0.03 - Math.max(0, rel) * 0.035, 0, 1);
      const enter = (1 - easeOut(rv)) * 9;
      const z = -FOCUS - rel - enter;
      /* em pé, os vizinhos vão mais para cima e para baixo que para os lados */
      const sx = card.spread[0] * (portrait ? 0.42 : 1), sy = card.spread[1] * (portrait ? 1.9 : 1);
      card.mesh.position.set(sx * away * k, sy * away * k, z * k);
      card.mesh.rotation.set(card.spread[1] * 0.05 * away, -card.spread[0] * 0.07 * away, 0);
      /* transparência: some atrás da câmera e no fim da fila */
      /* o que já passou: grande e de lado durante a passagem (como na 2ª
         tela), e some antes de o próximo assentar */
      const near = smoothstepJS(-D * 0.95, -D * 0.42, rel);
      /* só uns três para trás (como nas telas), e a volta da fila sem pulo */
      const far = (1 - smoothstepJS(2.3 * D, 3.6 * D, rel)) * (1 - smoothstepJS(L - 4.2 * D, L - 1.6 * D, rel));
      card.u.alpha.value = near * far * easeOut(rv);
      card.u.dim.value = THREE.MathUtils.clamp(rel / (D * 3.4), 0, 0.55);
      card.u.vel.value = speed;
      card.u.reveal.value = rv;
      card.hover += ((hovered === card.index ? 1 : 0) - card.hover) * (1 - Math.exp(-dt * 8));
      card.u.hover.value = card.hover;
      const s = 1 + card.hover * 0.025;
      card.mesh.scale.set(card.w * s, card.h * s, 1);
      card.mesh.visible = card.u.alpha.value > 0.002;
      card.mesh.renderOrder = -Math.round(rel * 10);   // de trás para a frente
    }
  };

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pick = (x: number, y: number) => {
    ndc.set(x, y);
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(cards.filter((c) => c.mesh.visible && c.u.alpha.value > 0.5).map((c) => c.mesh), false);
    return hits.length ? (hits[0].object.userData.index as number) : null;
  };

  const activeIndex = () => ((Math.round(pos) % N) + N) % N;
  const corner = new THREE.Vector3();

  return {
    update,
    nudge: (n) => { target += n; idle = 0; },
    goTo: (i) => {
      const cur = Math.round(target);
      const base = ((cur % N) + N) % N;
      let d = i - base;
      if (d > N / 2) d -= N;
      if (d < -N / 2) d += N;
      target = cur + d;
      idle = 0.5;
    },
    pick,
    setHover: (i) => { hovered = i; },
    active: () => {
      const i = activeIndex();
      const rel = cards[i].rel;
      return { index: i, focus: 1 - smoothstepJS(0.12, 0.55, Math.abs(rel) / D) };
    },
    anchor: (out) => {
      const c = cards[activeIndex()];
      c.mesh.updateMatrixWorld();
      corner.set(0.5, -0.5, 0).applyMatrix4(c.mesh.matrixWorld).project(camera);
      if (corner.z > 1) return false;
      out.x = (corner.x * 0.5 + 0.5) * window.innerWidth;
      out.y = (-corner.y * 0.5 + 0.5) * window.innerHeight;
      return true;
    },
    setReveal: (v) => { reveal = v; },
    setPointer: (x, y) => pointer.set(x, y),
    load: async (onProgress) => {
      /* as imagens são decodificadas fora da linha principal
         (createImageBitmap), já viradas para o lado que a GPU espera */
      const loader = new THREE.ImageBitmapLoader();
      loader.setOptions({ imageOrientation: "flipY", premultiplyAlpha: "none" });
      let done = 0;
      const maxAniso = renderer.getMaxAnisotropy?.() ?? 8;
      await Promise.all(cards.map(async (card) => {
        try {
          const bmp = await loader.loadAsync(imageUrl(card.project.card));
          const tex = new THREE.Texture(bmp as unknown as HTMLImageElement);
          tex.flipY = false;
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = Math.min(8, maxAniso);
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.needsUpdate = true;
          (card.mesh.userData.map as ReturnType<typeof texture>).value = tex;
        } catch (e) {
          console.warn("Não carregou:", card.project.card, e);
        }
        done++;
        onProgress(done / cards.length);
      }));
    },
  };
}

function smoothstepJS(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

