import { body } from "express-validator";
import memberRepository from "../repositories/memberRepository.js";
import { createRequire } from "module";

const createRequiredChain = (field, fieldName) =>
  body(field).trim().notEmpty().withMessage(`${fieldName} is required`);

const signupValidators = [
  createRequiredChain("email", "Email")
    .isEmail()
    .withMessage("Email must be in correct format")
    .custom(async (value) => {
      const rows = await memberRepository.findByEmail(value);
      if (rows.length > 0) {
        return Promise.reject();
      }

      return Promise.resolve(true);
    })
    .withMessage("Email already in use"),
  createRequiredChain("firstName", "First name")
    .isAlpha()
    .withMessage("Name can only contain letters"),
  createRequiredChain("lastName", "Last name")
    .isAlpha()
    .withMessage("Name can only contain letters"),
  createRequiredChain("password")
    .isLength({ min: 8, max: 30 })
    .withMessage("Password must be between 8 and 30 characters"),
  createRequiredChain("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords don't match"),
];

const messageValidators = [
  createRequiredChain("title", "Title").isLength({ max: 50 }),
  createRequiredChain("content", "Content")
    .isLength({ min: 10, max: 255 })
    .withMessage("Content must be between 10 and 255 characters."),
];

const keyValidator = createRequiredChain("key", "Key");

export { signupValidators, messageValidators, keyValidator };
