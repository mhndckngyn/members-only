import connectPgSimple from "connect-pg-simple";
import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import urls from "./config/appUrls.js";
import "./config/passport.js";
import memberController from "./controllers/memberController.js";
import messageController from "./controllers/messageController.js";
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

app.get(urls.login, memberController.loginGet);
app.get(urls.signup, memberController.signupGet);
app.post(urls.login, memberController.loginPost);
app.post(urls.signup, memberController.signupPost);
app.get(urls.logout, memberController.logout);

app.get(urls.home, messageController.homepageGet);
app.get(urls.newMessage, messageController.newMessageGet);
app.post(urls.newMessage, messageController.newMessagePost);
app.post(urls.deleteMessage, messageController.deleteMessagePost);

app.get(urls.upgradeAdmin, memberController.upgradeToAdminGet);
app.get(urls.upgradeSecretMember, memberController.upgradeToSecretMemberGet);
app.post(urls.upgradeAdmin, memberController.upgradeToAdminPost);
app.post(urls.upgradeSecretMember, memberController.upgradeToSecretMemberPost);

const PORT = 3000;
app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }

  console.log("Server running on port", PORT);
});
