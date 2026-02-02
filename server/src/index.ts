import express from "express";
import path from "path";
import cors from "cors";
import type { Request } from "express-serve-static-core";

const __dirname = path.resolve();
const app = express();
const port = process.env.PORT ?? "8080";

app.use(cors<Request>());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.get("/{*any}", (_, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

export default app;
