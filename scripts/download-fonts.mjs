// Pobiera pliki woff2 z Fontshare do public/fonts.
// Skrypt zamiast recznie wrzuconych binariow, zeby bylo widac skad sa fonty
// i zeby dalo sie je odtworzyc po zmianie zestawu grubosci.
import { mkdir, writeFile } from "node:fs/promises";

const CSS =
  "https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&f[]=cabinet-grotesk@700,800&display=swap";
const OUTPUT_DIR = "public/fonts";

const slugify = (family) => family.toLowerCase().replace(/\s+/g, "-");

const css = await fetch(CSS, {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text());

// Kazdy @font-face ma rodzine, grubosc i adres woff2. Wyciagamy te trzy rzeczy.
const blocks = css.split("@font-face").slice(1);
await mkdir(OUTPUT_DIR, { recursive: true });

let downloaded = 0;
for (const block of blocks) {
  const family = block.match(/font-family:\s*'([^']+)'/)?.[1];
  const weight = block.match(/font-weight:\s*(\d+)/)?.[1];
  const url = block.match(/url\('(\/\/[^']+\.woff2)'\)/)?.[1];
  if (!family || !weight || !url) continue;

  const fileName = `${slugify(family)}-${weight}.woff2`;
  const data = await fetch(`https:${url}`).then((r) => r.arrayBuffer());
  await writeFile(`${OUTPUT_DIR}/${fileName}`, Buffer.from(data));
  console.log(`${fileName}  ${(data.byteLength / 1024).toFixed(0)} kB`);
  downloaded++;
}

if (downloaded !== 6) {
  console.error(`Oczekiwano 6 plikow, pobrano ${downloaded}.`);
  process.exit(1);
}
