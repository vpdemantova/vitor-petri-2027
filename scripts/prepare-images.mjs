/* Prepara as imagens do site a partir das fontes em media/ (10/out/2026).
   · media/sites/: capturas de tela 1440 × 900 (o cartão) e, quando houver,
     a página inteira (-full), feitas no Edge;
   · media/design/: as peças de design, nos arquivos originais (o cartaz
     do Conservatório tem 12 MB).
   Saem em public/img/, em WebP: o cartão (a textura da galeria, até
   1280 px) e a imagem grande da ficha do projeto (até 2000 px; as páginas
   inteiras com 1200 px de largura).
   Rodar: npm run images */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'public/img';
fs.mkdirSync(OUT, { recursive: true });
const done = [];

async function save(src, dst, opts) {
  const img = sharp(src, { limitInputPixels: false });
  const meta = await img.metadata();
  let p = img.resize({ width: opts.w, height: opts.h, fit: 'inside', withoutEnlargement: true });
  await p.webp({ quality: opts.q ?? 80, effort: 5 }).toFile(dst);
  const out = await sharp(dst).metadata();
  done.push(`${path.basename(dst)}  ${meta.width}×${meta.height} → ${out.width}×${out.height}  ${(fs.statSync(dst).size / 1024).toFixed(0)} KB`);
  return { width: out.width, height: out.height };
}

const sizes = {};
for (const f of fs.readdirSync('media/sites')) {
  if (!/\.(jpe?g|png)$/i.test(f)) continue;
  const id = f.replace(/\.(jpe?g|png)$/i, '');
  const src = path.join('media/sites', f);
  if (id.endsWith('-full')) sizes[id] = await save(src, path.join(OUT, `${id}.webp`), { w: 1200, h: 16000, q: 74 });
  else sizes[id] = await save(src, path.join(OUT, `${id}.webp`), { w: 1280, h: 1280, q: 80 });
}
for (const f of fs.readdirSync('media/design')) {
  if (!/\.(jpe?g|png)$/i.test(f)) continue;
  const id = f.replace(/\.(jpe?g|png)$/i, '');
  const src = path.join('media/design', f);
  sizes[id] = await save(src, path.join(OUT, `${id}.webp`), { w: 1280, h: 1280, q: 84 });
  sizes[`${id}-full`] = await save(src, path.join(OUT, `${id}-full.webp`), { w: 2000, h: 2000, q: 84 });
}
fs.writeFileSync('src/data/image-sizes.json', JSON.stringify(sizes, null, 2) + '\n');
console.log(done.join('\n'));
