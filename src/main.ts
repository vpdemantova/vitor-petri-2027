/* ════════════════════════════════════════════════════════════════════
   VITOR PETRI — o começo de tudo (10/out/2026).

   O site é uma página só, com cinco estados (as telas de referência):
     · a abertura ("Preloader"): as coordenadas de Campinas e o logotipo
       grande, que se enche enquanto as imagens chegam e depois voa até o
       canto, onde fica;
     · a galeria ("Home / Gallery"): os projetos em profundidade, a
       etiqueta "Nome ↗ · VIEW PROJECT" presa ao canto do cartão da vez e o
       botão "Contact";
     · o Índice, o Perfil e a ficha do Projeto (painéis).
   O endereço guarda o estado (#/index, #/profile, #/project/<id>): o
   botão de voltar do navegador funciona e um link leva direto a um
   projeto.
════════════════════════════════════════════════════════════════════ */
import gsap from "gsap";
import "./styles/app.css";
import { PROJECTS } from "./data/projects";
import { SITE } from "./data/site";
import { wordmarkSVG } from "./ui/wordmark";
import { h, ARROW, prefersReducedMotion } from "./ui/dom";
import { createPanels, type PanelKind } from "./ui/panels";

const app = document.getElementById("app")!;
const canvas = document.getElementById("gl") as HTMLCanvasElement;
const reduced = prefersReducedMotion();

/* ── o alto: o logotipo e o menu ── */
const brand = h("a", { class: "brand", href: "#/", "aria-label": "Vitor Petri, back to the gallery", html: wordmarkSVG("Vitor Petri") });
const navIndex = h("a", { href: "#/index" }, "Index");
const navProfile = h("a", { href: "#/profile" }, "Profile");
const top = h("header", { class: "top" }, brand, h("nav", { class: "nav", "aria-label": "Main" }, navIndex, navProfile));

/* ── a etiqueta do cartão da vez ── */
const labelText = h("span", { class: "label-name-text" });
const labelName = h("a", { class: "label-name", target: "_blank", rel: "noopener noreferrer" }, labelText);
labelName.insertAdjacentHTML("beforeend", ARROW);
const labelCta = h("button", { class: "label-cta", type: "button" }, "View project");
const label = h("div", { class: "label" }, labelName, labelCta);

/* ── o contato ── */
const contactPill = h("button", { class: "contact-pill", type: "button", "aria-expanded": "false", "aria-controls": "contact-card" }, "Contact");
const contactCard = h("aside", { class: "contact-card", id: "contact-card", "aria-label": "Contact" },
  h("p", { class: "contact-kick" }, "Get in touch!"),
  h("a", { class: "contact-mail", href: `mailto:${SITE.email}` }, SITE.email),
  h("p", { class: "contact-socials-k" }, "Socials"),
  h("ul", { class: "contact-socials" }, ...SITE.socials.map((s) => h("li", {}, h("a", { href: s.href, target: "_blank", rel: "noopener noreferrer" }, s.label)))));

/* ── a abertura ── */
const preMark = h("div", { class: "pre-mark", "aria-hidden": "true" },
  h("div", { class: "pre-ghost", html: wordmarkSVG("") }),
  h("div", { class: "pre-fill", html: wordmarkSVG("") }));
const preloader = h("div", { class: "preloader", role: "status", "aria-live": "polite" },
  h("p", { class: "pre-coords", title: SITE.coordsTitle },
    h("span", { class: "pre-place" }, SITE.place), h("span", { class: "pre-num" }, SITE.coords)),
  preMark,
  h("span", { class: "sr-only" }, "Loading the gallery"));

/* para leitores de tela: o projeto da vez */
const live = h("p", { class: "sr-only", "aria-live": "polite" });

app.append(top, label, contactPill, contactCard, preloader, live);

/* ── os painéis e o endereço ── */
const panels = createPanels(app, {
  onClose: () => { location.hash = "#/"; },
  onFocusProject: (i) => gallery?.goTo(i),
  onOpenProject: (id) => { location.hash = `#/project/${id}`; },
});

function route() {
  const m = location.hash.match(/^#\/(index|profile|project)(?:\/([\w-]+))?/);
  const kind = (m?.[1] ?? null) as PanelKind | null;
  if (kind === "project" && m?.[2]) {
    const i = PROJECTS.findIndex((p) => p.id === m[2]);
    if (i >= 0) gallery?.goTo(i);
    panels.open("project", m[2]);
  } else if (kind) panels.open(kind);
  else panels.close();
  navIndex.toggleAttribute("aria-current", kind === "index");
  navProfile.toggleAttribute("aria-current", kind === "profile");
  if (kind === "index") navIndex.setAttribute("aria-current", "page");
  if (kind === "profile") navProfile.setAttribute("aria-current", "page");
}
window.addEventListener("hashchange", route);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (contactCard.classList.contains("is-open")) { toggleContact(false); return; }
    if (panels.current()) location.hash = "#/";
  }
});

/* ── o contato abre e fecha (a pílula vira o cartão) ── */
function toggleContact(open: boolean) {
  const isOpen = contactCard.classList.contains("is-open");
  if (open === isOpen) return;
  contactPill.setAttribute("aria-expanded", String(open));
  if (open) {
    contactCard.classList.add("is-open");
    if (!reduced) {
      gsap.fromTo(contactCard, { scale: 0.42, opacity: 0, borderRadius: 999 }, { scale: 1, opacity: 1, borderRadius: getComputedStyle(contactCard).borderRadius, duration: 0.7, ease: "expo.out", clearProps: "borderRadius" });
      gsap.fromTo(contactCard.children, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, delay: 0.12, ease: "power3.out" });
    }
    gsap.to(contactPill, { opacity: 0, duration: 0.2, pointerEvents: "none" });
    (contactCard.querySelector("a") as HTMLElement).focus({ preventScroll: true });
  } else {
    const done = () => { contactCard.classList.remove("is-open"); gsap.set(contactCard, { clearProps: "all" }); };
    if (reduced) done(); else gsap.to(contactCard, { scale: 0.5, opacity: 0, duration: 0.35, ease: "power3.in", onComplete: done });
    gsap.to(contactPill, { opacity: 1, duration: 0.3, delay: 0.15, pointerEvents: "auto" });
    contactPill.focus({ preventScroll: true });
  }
}
contactPill.addEventListener("click", () => toggleContact(true));
document.addEventListener("pointerdown", (e) => {
  if (contactCard.classList.contains("is-open") && !contactCard.contains(e.target as Node) && e.target !== contactPill) toggleContact(false);
});

/* ── o 3D ── */
let gallery: import("./gl/gallery").Gallery | null = null;
/* a galeria só responde (e a etiqueta só aparece) depois que os cartões chegam */
let introDone = false;

async function boot() {
  /* o 3D é carregado à parte (o three.js é grande); a interface já está na tela */
  const [{ createStage }, { createBackdrop }, { createGallery }] = await Promise.all([
    import("./gl/stage"), import("./gl/backdrop"), import("./gl/gallery"),
  ]);
  let stage;
  try {
    stage = await createStage(canvas);
  } catch (e) {
    /* sem WebGPU nem WebGL2: o site continua, com o índice como página */
    console.warn("Sem 3D:", e);
    document.documentElement.dataset.gpu = "none";
    finishIntro(null);
    location.hash = location.hash || "#/index";
    route();
    return;
  }
  document.documentElement.dataset.gpu = stage.backend;
  const backdrop = createBackdrop(stage.scene, reduced);
  const g = createGallery(stage.scene, stage.camera, stage.renderer, reduced);
  gallery = g;

  /* o mouse (alisado), para a paralaxe e o brilho */
  const mouse = { x: 0, y: 0, sx: 0, sy: 0, px: 0, py: 0, moved: false };
  let dragging = false, lastY = 0, lastX = 0, lastT = 0, flick = 0, downX = 0, downY = 0;
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    mouse.px = e.clientX; mouse.py = e.clientY; mouse.moved = true;
  }, { passive: true });

  /* a etiqueta segue o canto do cartão da vez */
  const anchor = { x: 0, y: 0 };
  let shown = -1, labelAlpha = 0, lx = 0, ly = 0, firstLabel = true;
  const setLabel = (i: number) => {
    const p = PROJECTS[i];
    const swap = () => {
      labelText.textContent = p.name;
      if (p.url) { labelName.setAttribute("href", p.url); labelName.removeAttribute("aria-disabled"); }
      else { labelName.removeAttribute("href"); labelName.setAttribute("aria-disabled", "true"); }
      labelName.setAttribute("aria-label", p.url ? `${p.name}, visit the website (opens in a new tab)` : `${p.name}, not published`);
      labelCta.setAttribute("aria-label", `View project: ${p.name}`);
      live.textContent = `${p.name}, ${p.type}`;
    };
    if (reduced || shown < 0) { swap(); return; }
    gsap.to(labelText, { yPercent: -110, opacity: 0, duration: 0.18, ease: "power2.in", onComplete: () => { swap(); gsap.fromTo(labelText, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.32, ease: "power3.out" }); } });
  };
  labelCta.addEventListener("click", () => { location.hash = `#/project/${PROJECTS[g.active().index].id}`; });


  stage.onFrame((dt) => {
    mouse.sx += (mouse.x - mouse.sx) * (1 - Math.exp(-dt * 4));
    mouse.sy += (mouse.y - mouse.sy) * (1 - Math.exp(-dt * 4));
    backdrop.setMouse(reduced ? 0 : mouse.sx, reduced ? 0 : mouse.sy);
    g.setPointer(mouse.sx, mouse.sy);
    g.update(dt);

    /* a etiqueta: aparece com o cartão no foco, some com painel aberto */
    const { index, focus } = g.active();
    if (index !== shown) { setLabel(index); shown = index; }
    const panel = panels.current();
    const want = introDone && (!panel || panel === "index") && focus > 0.55 && g.anchor(anchor) ? 1 : 0;
    labelAlpha += (want - labelAlpha) * (1 - Math.exp(-dt * 10));
    label.classList.toggle("is-on", labelAlpha > 0.01);
    if (want) {
      const w = label.offsetWidth, hgt = label.offsetHeight;
      /* a pílula atravessa o canto: 64% dela fica antes do canto (como nas telas) */
      let tx = anchor.x - w * 0.64, ty = anchor.y - hgt / 2;
      tx = Math.min(window.innerWidth - w - 12, Math.max(12, tx));
      ty = Math.min(window.innerHeight - hgt - 12, Math.max(64, ty));
      if (firstLabel) { lx = tx; ly = ty; firstLabel = false; }
      lx += (tx - lx) * (1 - Math.exp(-dt * 14));
      ly += (ty - ly) * (1 - Math.exp(-dt * 14));
    }
    label.style.opacity = labelAlpha.toFixed(3);
    label.style.transform = `translate3d(${lx.toFixed(1)}px, ${ly.toFixed(1)}px, 0) scale(${(0.92 + labelAlpha * 0.08).toFixed(3)})`;

    /* o cartão sob o mouse (só sem painel por cima) */
    if (introDone && mouse.moved && !panels.current()) {
      const hit = g.pick(mouse.x, mouse.y);
      g.setHover(hit);
      canvas.style.cursor = hit !== null ? "pointer" : dragging ? "grabbing" : "grab";
    }
  });
  stage.start();

  /* ── a rolagem: roda, arrastar (com embalo), teclado ── */
  const blocked = () => !introDone || (panels.current() && panels.current() !== "index");
  window.addEventListener("wheel", (e) => {
    if (blocked() || panels.current() === "index") return;
    const scale = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? 600 : 1;
    const d = (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * scale;
    g.nudge(Math.max(-0.6, Math.min(0.6, d / 420)));
  }, { passive: true });

  canvas.addEventListener("pointerdown", (e) => {
    if (blocked()) return;
    dragging = true; lastX = downX = e.clientX; lastY = downY = e.clientY; lastT = performance.now(); flick = 0;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dy = e.clientY - lastY, dx = e.clientX - lastX;
    const now = performance.now();
    const step = -(dy + dx * 0.7) / (e.pointerType === "touch" ? 230 : 320);
    g.nudge(step);
    flick = step / Math.max(1, now - lastT) * 16;
    lastY = e.clientY; lastX = e.clientX; lastT = now;
  });
  const endDrag = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
    if (moved < 6) {
      /* um toque: no cartão da vez abre o projeto; em outro, vai até ele */
      const hit = g.pick((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
      if (hit !== null) {
        if (hit === g.active().index) location.hash = `#/project/${PROJECTS[hit].id}`;
        else g.goTo(hit);
      }
    } else if (Math.abs(flick) > 0.02) g.nudge(Math.max(-1.5, Math.min(1.5, flick * 6)));
  };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  window.addEventListener("keydown", (e) => {
    if (blocked() || panels.current()) return;
    if ((e.target as HTMLElement).closest("input, textarea")) return;
    if (["ArrowDown", "ArrowRight", "PageDown", "j"].includes(e.key)) { g.nudge(1); e.preventDefault(); }
    else if (["ArrowUp", "ArrowLeft", "PageUp", "k"].includes(e.key)) { g.nudge(-1); e.preventDefault(); }
    else if (e.key === "Home") g.goTo(0);
    else if (e.key === "End") g.goTo(PROJECTS.length - 1);
    else if (e.key === "Enter" && document.activeElement === document.body) location.hash = `#/project/${PROJECTS[g.active().index].id}`;
  });

  /* ── a abertura: as imagens chegam, a palavra se enche ── */
  const fill = { p: 0 };
  const fillTo = (v: number) => gsap.to(fill, { p: v, duration: 0.6, ease: "power2.out", overwrite: true, onUpdate: () => preMark.style.setProperty("--p", `${(fill.p * 100).toFixed(1)}%`) });
  backdrop.setIntensity(0);
  gsap.to({ v: 0 }, { v: 1, duration: reduced ? 0.01 : 1.6, ease: "power2.out", onUpdate() { backdrop.setIntensity(this.targets()[0].v); } });
  await g.load((p) => fillTo(p * 0.98));
  fillTo(1);
  await new Promise((r) => setTimeout(r, reduced ? 50 : 700));
  finishIntro(g);
}

/** a abertura sai: o logotipo grande voa até o lugar do pequeno */
function finishIntro(g: import("./gl/gallery").Gallery | null) {
  const from = preMark.getBoundingClientRect();
  const to = brand.getBoundingClientRect();
  const sx = to.width / from.width, sy = to.height / from.height;
  const done = () => { preloader.remove(); gsap.set(brand, { opacity: 1 }); if (!introDone) { introDone = true; route(); } };
  if (reduced || !g) {
    gsap.set([top, contactPill, ".nav a"], { opacity: 1 });
    g?.setReveal(1);
    done();
    return;
  }
  gsap.set(brand, { opacity: 0 });
  const tl = gsap.timeline({ onComplete: done });
  tl.to(".pre-coords", { opacity: 0, y: -12, duration: 0.5, ease: "power2.in" }, 0)
    .to(preMark, { x: to.left - from.left, y: to.top - from.top, scaleX: sx, scaleY: sy, transformOrigin: "0 0", duration: 1.15, ease: "expo.inOut" }, 0.1)
    .to(".pre-ghost", { opacity: 0, duration: 0.4 }, 0.1)
    .fromTo(".nav a", { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }, 0.7)
    .fromTo(contactPill, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.85)
    .to({ v: 0 }, { v: 1, duration: 2.2, ease: "power2.out", onUpdate() { g.setReveal(this.targets()[0].v); } }, 0.35)
    .call(() => { if (!introDone) { introDone = true; route(); } }, [], 1.7);
}

/* antes do 3D: o logotipo pequeno, o menu e o contato esperam a abertura */
gsap.set(brand, { opacity: 0 });
gsap.set(".nav a", { opacity: 0 });
gsap.set(contactPill, { opacity: 0 });
boot();
