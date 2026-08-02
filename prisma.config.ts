import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Ten plik czyta wylacznie CLI Prismy: migracje, studio, seed. Aplikacja
// w czasie dzialania go nie widzi, ona bierze polaczenie z adaptera.
// Dlatego celowo idzie tu DIRECT_URL: migracje potrzebuja sesyjnego
// polaczenia i nie przechodza przez pooler.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
