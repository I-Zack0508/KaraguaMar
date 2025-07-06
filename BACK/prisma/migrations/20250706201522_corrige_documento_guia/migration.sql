/*
  Warnings:

  - You are about to drop the column `arquivos` on the `DocumentoGuia` table. All the data in the column will be lost.
  - Added the required column `arquivo` to the `DocumentoGuia` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DocumentoGuia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cpf" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "arquivo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DocumentoGuia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DocumentoGuia" ("cep", "cpf", "createdAt", "id", "userId") SELECT "cep", "cpf", "createdAt", "id", "userId" FROM "DocumentoGuia";
DROP TABLE "DocumentoGuia";
ALTER TABLE "new_DocumentoGuia" RENAME TO "DocumentoGuia";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
