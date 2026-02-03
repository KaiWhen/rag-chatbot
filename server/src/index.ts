import express from "express";
import path from "path";
import cors from "cors";
import type { Request } from "express-serve-static-core";
import uploadPDFRouter from "./routes/upload-pdf.route";
import queryRouter from "./routes/query.route";

const __dirname = path.resolve();
const app = express();
const port = process.env.PORT ?? "8080";

app.use(cors<Request>());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.get("/{*any}", (_, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

app.use('/upload-pdf', uploadPDFRouter);
app.use('/query', queryRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
