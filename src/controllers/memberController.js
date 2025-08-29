import { matchedData, validationResult } from "express-validator";
import passport from "passport";
import appUrls from "../config/appUrls.js";
import memberRepository from "../repositories/memberRepository.js";
import * as argon2 from "argon2";

const memberController = {
  loginGet: async function (req, res) {
    res.render("login");
  },

  loginPost: async function (req, res) {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        res.status(500).render("login", {
          errors: ["There is an unexpected error. Please try again."],
        });
      } else if (info) {
        res.status(400).render("login", { errors: [info.message] });
      } else {
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }

          return res.redirect(appUrls.home);
        });
      }
    })(req, res, next);
  },

  signupGet: async function (req, res) {
    res.render("signup");
  },

  signupPost: async function (req, res) {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array().map((err) => err.msg);
      return res.render("signup", { errors });
    }

    const { firstName, lastName, email, password } = matchedData(req);
    const hashed = await argon2.hash(password);

    const [user] = await memberRepository.insert({
      firstName,
      lastName,
      email,
      password: hashed,
    });

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.redirect(appUrls.home);
    });
  },
};

export default memberController;
