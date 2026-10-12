/* ════════════════════════════════════════════════════════════════════
   OS PAINÉIS: o Índice, o Perfil e a ficha do Projeto (as telas "Index",
   "Profile" e "Project" das referências).

   · Índice: branco, à esquerda, sobe do pé da tela; filtros (All,
     Websites, Design, Experiments) e a tabela nome · tipo · VISIT ↗ · ano.
     Passar o mouse (ou o foco do teclado) numa linha leva a galeria até
     aquele projeto, que aparece à direita, atrás do painel.
   · Perfil: o texto grande em serifa à esquerda e duas linhas embaixo à
     direita, num cartão branco que se abre de dentro para fora.
   · Projeto: o vidro claro com o nome, ROLE / TYPE / STACK, VISIT WEBSITE
     e a descrição à esquerda, e as imagens (as páginas inteiras) rolando
     à direita.
   Os três são diálogos de verdade (role="dialog", o Tab fica dentro, Esc
   fecha, o foco volta para onde estava). As animações são do GSAP.
════════════════════════════════════════════════════════════════════ */
import gsap from "gsap";
import { PROJECTS, CATEGORY_LABEL, imageUrl, type Category, type Project } from "../data/projects";
import { PROFILE } from "../data/site";
import { h, ARROW, CROSS, trapFocus, prefersReducedMotion } from "./dom";

export type PanelKind = "index" | "profile" | "project";

/* a composição do perfil: três peças dele, de verdade */
const PROFILE_ART = [
  { img: "dimensional-heritage", alt: "Herança Dimensional, a geometric mandala", caption: "Herança Dimensional" },
  { img: "sun-lettering", alt: "De tanta luz dói olhar pro sol, a type poster", caption: "De tanta luz…" },
  { img: "poster-ccg", alt: "Conservatório Carlos Gomes, a poster", caption: "Carlos Gomes" },
];

interface Opts {
  onClose: () => void;
  onFocusProject: (index: number) => void;
  onOpenProject: (id: string) => void;
}

export function createPanels(root: HTMLElement, opts: Opts) {
  const closeBtn = (label: string) => {
    const b = h("button", { class: "close", type: "button", "aria-label": label, title: `${label} (Esc)`, html: CROSS });
    b.addEventListener("click", opts.onClose);
    return b;
  };

  /* ── o Índice ── */
  const filters = h("fieldset", { class: "filters" }, h("legend", { class: "sr-only" }, "Filter the projects"));
  (["all", "websites", "design", "experiments"] as (Category | "all")[]).forEach((c, i) => {
    const input = h("input", { type: "radio", name: "filter", value: c, checked: i === 0 });
    filters.append(h("label", {}, input, CATEGORY_LABEL[c]));
  });
  const list = h("ul", { class: "index-list" });
  const rows = PROJECTS.map((p, i) => {
    const visit = p.url
      ? h("a", { class: "index-visit", href: p.url, target: "_blank", rel: "noopener noreferrer", html: `Visit ${ARROW}`, "aria-label": `Visit ${p.name} (opens in a new tab)` })
      : h("span", { class: "index-visit is-off" }, "Private");
    const name = h("button", { class: "index-name", type: "button", title: p.name }, p.name);
    name.addEventListener("click", () => opts.onOpenProject(p.id));
    const row = h("li", { class: "index-row", "data-cat": p.category }, name, h("span", { class: "index-type" }, p.type), visit, h("span", { class: "index-year" }, p.year ?? ""));
    const focusIt = () => { rows.forEach((r) => r.classList.toggle("is-on", r === row)); opts.onFocusProject(i); };
    row.addEventListener("pointerenter", focusIt);
    name.addEventListener("focus", focusIt);
    list.append(row);
    return row;
  });
  filters.addEventListener("change", () => {
    const v = (filters.querySelector("input:checked") as HTMLInputElement).value;
    rows.forEach((r) => { r.hidden = v !== "all" && r.dataset.cat !== v; });
    if (!prefersReducedMotion()) gsap.fromTo(rows.filter((r) => !r.hidden), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.035, ease: "power3.out" });
  });
  const indexPanel = h("section", { class: "panel index-panel", role: "dialog", "aria-modal": "true", "aria-labelledby": "index-title", tabindex: "-1" },
    h("h2", { id: "index-title", class: "sr-only" }, "Index of projects"), filters, closeBtn("Close the index"), list);

  /* ── o Perfil ── */
  const profilePanel = h("section", { class: "panel profile-panel", role: "dialog", "aria-modal": "true", "aria-labelledby": "profile-title", tabindex: "-1" },
    h("h2", { id: "profile-title", class: "sr-only" }, "Profile"),
    closeBtn("Close the profile"),
    h("div", { class: "profile-text" }, ...PROFILE.body.map((t) => h("p", {}, t))),
    h("div", { class: "profile-art" }, ...PROFILE_ART.map((a) => h("figure", {}, h("img", { src: imageUrl(a.img), alt: a.alt, loading: "lazy", decoding: "async" }), h("figcaption", {}, a.caption)))),
    h("p", { class: "profile-aside" }, PROFILE.aside[0], h("br"), PROFILE.aside[1]));

  /* ── o Projeto (preenchido a cada abertura) ── */
  const projectPanel = h("section", { class: "panel project-panel", role: "dialog", "aria-modal": "true", "aria-labelledby": "project-title", tabindex: "-1" });
  const fillProject = (p: Project) => {
    const meta = h("dl", {});
    const add = (k: string, v?: string) => { if (v) meta.append(h("div", {}, h("dt", {}, k), h("dd", {}, v))); };
    add("Role", p.role); add("Type", p.type); add("Stack", p.stack); add("Year", p.year);
    const visit = p.url
      ? h("a", { class: "project-visit", href: p.url, target: "_blank", rel: "noopener noreferrer", html: `Visit website ${ARROW}` })
      : h("span", { class: "project-visit is-off" }, "Not published yet");
    const shots = h("div", { class: "project-shots" },
      ...p.shots.map((s, i) => h("img", {
        src: imageUrl(s), alt: i === 0 ? `${p.name}: ${p.type}` : "", loading: i === 0 ? "eager" : "lazy", decoding: "async",
        class: p.category === "design" ? "is-art" : undefined,
      })));
    projectPanel.replaceChildren(
      closeBtn("Close the project"),
      h("div", { class: "project-info" },
        h("h2", { id: "project-title", class: "project-title" }, p.name),
        h("div", { class: "project-meta" }, meta, visit),
        h("p", { class: "project-desc" }, p.description)),
      shots);
  };

  root.append(indexPanel, profilePanel, projectPanel);
  const panels: Record<PanelKind, HTMLElement> = { index: indexPanel, profile: profilePanel, project: projectPanel };
  let current: PanelKind | null = null;
  let release: (() => void) | null = null;

  const animIn = (kind: PanelKind, el: HTMLElement) => {
    const reduce = prefersReducedMotion();
    gsap.killTweensOf(el);
    if (reduce) { gsap.set(el, { clearProps: "all" }); return; }
    if (kind === "index") {
      gsap.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: 0.9, ease: "expo.out" });
      gsap.fromTo(el.querySelectorAll(".filters label, .index-row:not([hidden])"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, delay: 0.25, ease: "power3.out" });
    } else if (kind === "profile") {
      gsap.fromTo(el, { clipPath: "inset(48% 48% 48% 48% round 40px)", opacity: 1 }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.0, ease: "expo.inOut", clearProps: "clipPath" });
      gsap.fromTo(el.querySelectorAll(".profile-text p, .profile-art figure, .profile-aside"), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, delay: 0.45, ease: "power3.out" });
    } else {
      gsap.fromTo(el, { opacity: 0, scale: 0.94, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.85, ease: "expo.out" });
      gsap.fromTo(el.querySelectorAll(".project-info > *"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, delay: 0.2, ease: "power3.out" });
      gsap.fromTo(el.querySelector(".project-shots"), { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.9, delay: 0.15, ease: "expo.out" });
    }
  };
  const animOut = (kind: PanelKind, el: HTMLElement, done: () => void) => {
    if (prefersReducedMotion()) { done(); return; }
    gsap.killTweensOf(el);
    if (kind === "index") gsap.to(el, { yPercent: 100, duration: 0.55, ease: "power3.in", onComplete: done });
    else if (kind === "profile") gsap.to(el, { clipPath: "inset(48% 48% 48% 48% round 40px)", duration: 0.55, ease: "power3.in", onComplete: done });
    else gsap.to(el, { opacity: 0, scale: 0.96, y: 20, duration: 0.4, ease: "power2.in", onComplete: done });
  };

  const hide = (kind: PanelKind) => {
    const el = panels[kind];
    animOut(kind, el, () => { el.classList.remove("is-open"); gsap.set(el, { clearProps: "all" }); });
  };

  return {
    current: () => current,
    open(kind: PanelKind, projectId?: string) {
      if (kind === "project") {
        const p = PROJECTS.find((q) => q.id === projectId);
        if (!p) return;
        fillProject(p);
      }
      if (current && current !== kind) { release?.(); release = null; hide(current); }
      const el = panels[kind];
      const was = current === kind;
      current = kind;
      document.documentElement.classList.add("has-panel");
      el.classList.add("is-open");
      if (!was || kind === "project") animIn(kind, el);
      release?.();
      release = trapFocus(el);
      requestAnimationFrame(() => (el.querySelector<HTMLElement>(".close") ?? el).focus({ preventScroll: true }));
    },
    close() {
      if (!current) return;
      release?.(); release = null;
      hide(current);
      current = null;
      document.documentElement.classList.remove("has-panel");
    },
  };
}
