/* ════════════════════════════════════════════════════════════════════
   O FUNDO: o brilho lavanda das telas, num shader (TSL).

   Medido ponto a ponto na tela de abertura (3840 × 2160): é uma elipse que
   encosta nas quatro bordas da tela (raio = metade da largura na
   horizontal, metade da altura na vertical) e a cor cai em linha reta, nos
   valores sRGB, de #878EE9 no centro até o preto na borda:
       cor(r) = #878EE9 · (1 − r),   r = √(((x − ½)/½)² + ((y − ½)/½)²)
   Igual ao radial-gradient do CSS que está por baixo.

   O que o shader soma, de leve:
   · pontilhado (dithering): ±½ degrau de cor sorteado por pixel. Degradê
     escuro em 8 bits faz "degraus" visíveis; o ruído some com eles;
   · o centro do brilho segue o mouse um pouco (2% da tela) e respira
     devagar (±1,5% de intensidade). Com "reduzir movimento", parado.
════════════════════════════════════════════════════════════════════ */
import * as THREE from "three/webgpu";
import { Fn, uniform, vec2, vec3, vec4, float, length, clamp, screenUV, screenCoordinate, hash, sin, positionGeometry, sRGBTransferEOTF, time } from "three/tsl";

export function createBackdrop(scene: THREE.Scene, reduced: boolean) {
  const uMouse = uniform(new THREE.Vector2(0, 0));
  const uIntensity = uniform(1);
  const uBreath = uniform(reduced ? 0 : 1);

  const mat = new THREE.MeshBasicNodeMaterial({ depthTest: false, depthWrite: false });
  /* o retângulo cobre a tela inteira, direto no espaço de recorte */
  mat.vertexNode = vec4(positionGeometry.xy, 0, 1);
  mat.colorNode = Fn(() => {
    const center = vec2(0.5, 0.5).add(uMouse.mul(0.02));
    const p = screenUV.sub(center).div(0.5);
    const r = length(p);
    const breath = float(1).add(sin(time.mul(0.55)).mul(0.015).mul(uBreath));
    const k = clamp(float(1).sub(r), 0, 1).mul(uIntensity).mul(breath);
    const base = vec3(135 / 255, 142 / 255, 233 / 255);
    /* o pontilhado, em valores sRGB (meio degrau de 1/255 para cada lado) */
    const n = hash(screenCoordinate.x.add(screenCoordinate.y.mul(4099.0))).sub(0.5).div(255);
    const srgb = clamp(base.mul(k).add(n), 0, 1);
    /* a saída do renderizador converte de linear para sRGB: devolve linear */
    return sRGBTransferEOTF(srgb) as unknown as ReturnType<typeof vec3>;
  })();

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = -100;
  scene.add(mesh);

  return {
    /** o mouse em −1…1 (alisado por quem chama) */
    setMouse: (x: number, y: number) => uMouse.value.set(x, -y),
    /** 0…1: a abertura acende o brilho */
    setIntensity: (v: number) => { uIntensity.value = v; },
  };
}
