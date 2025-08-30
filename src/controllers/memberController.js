import { matchedData, validationResult } from "express-validator";
import passport from "passport";
import appUrls from "../config/appUrls.js";
import memberRepository from "../repositories/memberRepository.js";
import * as argon2 from "argon2";
import { keyValidator, signupValidators } from "../middlewares/validators.js";
import { authUser } from "../middlewares/authenticate.js";

const memberController = {
  loginGet: async function (req, res) {
    if (req.user) {
      return res.redirect(urls.home);
    }

    res.render("login");
  },

  loginPost: async function (req, res, next) {
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
    if (req.user) {
      return res.redirect(urls.home);
    }

    res.render("signup");
  },

  signupPost: [
    signupValidators,
    async function (req, res) {
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
  ],

  logout: async (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }

      res.redirect(appUrls.home);
    });
  },

  upgradeToAdminGet: [
    authUser,
    async (req, res) => {
      res.render("upgrade-admin");
    },
  ],

  upgradeToAdminPost: [
    keyValidator,
    async (req, res) => {
      if (!req.user) {
        return res.status(401).send("Unauthorized");
      }

      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((err) => err.msg);
        return res.render("upgrade-admin", { errors });
      }

      const body = matchedData(req);

      if (body.key === "sudo admin") {
        await memberRepository.updateToAdmin(req.user.id);

        return res.redirect(appUrls.home);
      } else {
        res.render("upgrade-admin", { errors: ["Key is not correct"] });
      }
    },
  ],

  upgradeToSecretMemberGet: [
    authUser,
    async (req, res) => {
      res.render("upgrade-secret-member");
    },
  ],

  upgradeToSecretMemberPost: [
    keyValidator,
    async (req, res) => {
      if (!req.user) {
        return res.status(401).send("Unauthorized");
      }

      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((err) => err.msg);
        return res.render("upgrade-secret-member", { errors });
      }

      const body = matchedData(req);

      if (body.key === "sudo secret member") {
        await memberRepository.updateToSecret(req.user.id);

        return res.redirect(appUrls.home);
      } else {
        res.render("upgrade-secret-member", { errors: ["Key is not correct"] });
      }
    },
  ],
};

export default memberController;
