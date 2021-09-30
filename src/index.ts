import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

async function main() {
  const newUser = await prisma.user.create({
    data: {
      name: "Janice",
      email: "janice@gmail.com",
      groups: {
        connectOrCreate: [
          {
            where: {
              id: 1,
            },
            create: {
              id: 1,
              title: "Eu odeio acordar cedo",
            },
          },
        ],
      },
    },
  });

  console.log("Novo usuário criado: ", newUser);

  const allUsers = await prisma.user.findMany({
    include: { groups: true },
  });
  console.log("Todos os usuários: ");
  console.dir(allUsers, { depth: null });
}

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/user", async (req, res) => {
  const result = await prisma.user.create({
    data: { ...req.body },
  });
  res.json(result);
});

app.post("/group", async (req, res) => {
  const { title } = req.body;
  const result = await prisma.group.create({
    data: {
      title,
    },
  });
  res.json(result);
});

app.listen(3000, () =>
  console.log("Servidor rodando em: http://localhost:3000")
);

main();
