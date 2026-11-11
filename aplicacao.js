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
        isAdmin: user.isAdmin,
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


//middleware é uma função que tem acesso ao objeto de requisição(req), ao objeto de resposta(res) 
//é a proxima função de middleware no ciclo de requisição-resposta da aplicação. A próxima função de middleware é comumente denotada por uma variável chamada next.


const authenticatedToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      mensagem: "Token não fornecido",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      mensagem: "Formato do token inválido",
    });
  }

  jwt.verify(token, secret_key, (err, user) => {
    if (err) {
      return res.status(403).json({
        mensagem: "Token inválido ou expirado",
      });
    }

    req.user = user;

    console.log(`Usuário autenticado: ${JSON.stringify(user)}`);

    next();
  });
};

    



app.get("/protected", authenticatedToken, (req, res) => {
  res.json({
    mensagem: "Acesso permitido",
    user: req.user,
  });
});



app.get("/admin", authenticatedToken, (req, res) => {
  if (req.user.isAdmin) {
    res.json({
      mensagem: "Acesso permitido para administradores",
      user: req.user,
    });
  } else {
    res.status(403).json({
      mensagem: "Acesso negado. Você não é um administrador.",
      user: req.user,
    });
  }
});

app.use("/", (req, res) => {
  res.status(404).send("Rota não encontrada");
});




app.listen(port, () => {
  console.log("Aplicação Rodando na porta " + port);
});
