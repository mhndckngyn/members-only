import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded());

const PORT = 3000;
app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }

  console.log("Server running on port", PORT);
});
