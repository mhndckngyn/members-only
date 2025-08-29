import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import urls from "./config/appUrls.js";
import "./config/passport.js";
import memberController from "./controllers/memberController.js";
import { signupValidators } from "./middlewares/validators.js";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./repositories/db.js";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const isProduction = process.env.NODE_ENV === "production";
const pgSession = connectPgSimple(session);
app.use(
  session({
    store: new pgSession({ pool, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: isProduction,
      secure: isProduction,
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    },
  })
);
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));

app.get(urls.login, async (req, res) => {
  if (req.user) {
    return res.redirect(urls.home);
  }

  res.render("login");
});

app.post(urls.login, async (req, res, next) => {
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

      return res.redirect(urls.home);
    });
  })(req, res, next);
});

app.get(urls.home, async (req, res) => {
  res.render("home", { user: req.user || null });
});

app.get(urls.signup, async (req, res) => {
  if (req.user) {
    return res.redirect(urls.home);
  }

  res.render("signup");
});

app.post(urls.signup, signupValidators, memberController.signupPost);

app.get(urls.logout, async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.redirect(urls.home);
  });
});

const PORT = 3000;
app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }

  console.log("Server running on port", PORT);
});
