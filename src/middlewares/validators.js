import { body } from "express-validator";
import memberRepository from "../repositories/memberRepository.js";

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

export { signupValidators };
