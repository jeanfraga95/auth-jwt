import express from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

import users from "./users.js";
const app = express();


app.use(express.json());

app.get("/", (req, res) => {
  res.send("api funcionando");
});



app.use("/", (req, res) => {
  res.status(404).send("Rota não encontrada");
});




app.listen(port, () => {
  console.log("Aplicação Rodando na porta " + port);
});
