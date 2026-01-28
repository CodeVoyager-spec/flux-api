import express from "express";

const app = express();

app.use(express.json());

app.get("/helth", (req, res) => {
  res.send("Welcome to Flux Api");
});

export default app;
