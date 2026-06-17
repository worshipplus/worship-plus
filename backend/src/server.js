import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import setlistRouter from "./routes/setlist.js";
import eventsRouter from "./routes/events.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

// Rotas
app.use("/api/users", usersRouter);
app.use("/api/setlist", setlistRouter);
app.use("/api/events", eventsRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.listen(PORT, () => {
  console.log(`Worship+ Backend rodando em http://localhost:${PORT}`);
  console.log(`  GET  /api/health`);
  console.log(`  GET  /api/users`);
  console.log(`  POST /api/users`);
  console.log(`  GET  /api/setlist`);
  console.log(`  POST /api/setlist`);
  console.log(`  GET  /api/events`);
  console.log(`  POST /api/events`);
  console.log(`  GET  /api/events/:id`);
});

export default app;
