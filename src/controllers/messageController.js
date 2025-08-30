import { matchedData, validationResult } from "express-validator";
import messageRepository from "../repositories/messageRepository.js";
import appUrls from "../config/appUrls.js";
import { authUser } from "../middlewares/authenticate.js";
import { messageValidators } from "../middlewares/validators.js";

const messageController = {
  homepageGet: async function (req, res) {
    const messages = await messageRepository.getAll();
    res.render("home", { messages, user: req.user || null });
  },

  newMessageGet: [
    authUser,
    async function (req, res) {
      res.render("new-message");
    },
  ],

  newMessagePost: [
    messageValidators,
    async function (req, res) {
      if (!req.user) {
        return res.status(401).send("Unauthorized.");
      }

      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((err) => err.msg);
        return res.render("new-message", { errors });
      }

      const { title, content } = matchedData(req);
      await messageRepository.insert({ title, content, memberId: req.user.id });
      res.redirect(appUrls.home);
    },
  ],

  deleteMessagePost: async function (req, res) {
    if (!req.user || req.user.status !== "admin") {
      return res.status(401).send("Unauthorized");
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).send("Bad request");
    }

    await messageRepository.delete(id);
    res.redirect(appUrls.home);
  },
};

export default messageController;
