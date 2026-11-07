import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";


import users from "./users.js";
const app = express();


const port = process.env.port;
const secret_key = process.env.secret_key;


app.use(express.json());

app.get("/", (req, res) => {
  res.send("api funcionando");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        isadmin: user.isadmin,
      },
      secret_key,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } else {
    res.status(401).json({
      mensagem: "Usuário ou senha incorretos",
    });
  }
});

app.use("/", (req, res) => {
  res.status(404).send("Rota não encontrada");
});




app.listen(port, () => {
  console.log("Aplicação Rodando na porta " + port);
});
