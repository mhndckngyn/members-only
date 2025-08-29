import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import "./config/passport.js";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));

app.get("/login", async (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      res.status(500).render("login", {
        errors: ["There is an unexpected error. Please try again."],
      });
    }

    if (info) {
      res.status(400).render("login", { errors: [info.message] });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.redirect("/home");
    });
  })(req, res, next);
});

app.get("/home", async (req, res) => {
  res.render("home");
});

app.get("/error", async (req, res) => {
  res.render("error");
});

const PORT = 3000;
app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }

  console.log("Server running on port", PORT);
});
