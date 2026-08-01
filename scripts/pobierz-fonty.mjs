// Pobiera pliki woff2 z Fontshare do public/fonts.
// Skrypt zamiast recznie wrzuconych binariow, zeby bylo widac skad sa fonty
// i zeby dalo sie je odtworzyc po zmianie zestawu grubosci.
import { mkdir, writeFile } from "node:fs/promises";

const CSS =
  "https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&f[]=cabinet-grotesk@700,800&display=swap";
const KATALOG = "public/fonts";

const slug = (rodzina) => rodzina.toLowerCase().replace(/\s+/g, "-");

const css = await fetch(CSS, {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text());

// Kazdy @font-face ma rodzine, grubosc i adres woff2. Wyciagamy te trzy rzeczy.
const bloki = css.split("@font-face").slice(1);
await mkdir(KATALOG, { recursive: true });

let pobrane = 0;
for (const blok of bloki) {
  const rodzina = blok.match(/font-family:\s*'([^']+)'/)?.[1];
  const grubosc = blok.match(/font-weight:\s*(\d+)/)?.[1];
  const url = blok.match(/url\('(\/\/[^']+\.woff2)'\)/)?.[1];
  if (!rodzina || !grubosc || !url) continue;

  const nazwa = `${slug(rodzina)}-${grubosc}.woff2`;
  const dane = await fetch(`https:${url}`).then((r) => r.arrayBuffer());
  await writeFile(`${KATALOG}/${nazwa}`, Buffer.from(dane));
  console.log(`${nazwa}  ${(dane.byteLength / 1024).toFixed(0)} kB`);
  pobrane++;
}

if (pobrane !== 6) {
  console.error(`Oczekiwano 6 plikow, pobrano ${pobrane}.`);
  process.exit(1);
}
