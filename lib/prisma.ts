//acest fisier e pt a creat clientul singleton din prisma, adica o singura instanta a clientului prisma care poate fi folosita in toata aplicatia, asta e important pentru a evita problemele de conexiune la baza de date si pentru a imbunatati performanta aplicatiei. Practic, cand import acest client in alte fisiere, voi primi aceeasi instanta, ceea ce inseamna ca toate operatiunile pe baza de date vor fi gestionate eficient si fara conflicte.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
