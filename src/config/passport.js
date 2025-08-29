import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import * as argon2 from "argon2";
import memberRepository from "../repositories/memberRepository.js";

const verifyCallback = async (email, password, done) => {
  try {
    const rows = await memberRepository.findByEmail(email);
    if (rows.length !== 1) {
      return done(null, false, {
        message: "Username or password is not correct",
      });
    }

    const user = rows[0];
    const isMatchingPassword = await argon2.verify(user.password, password);

    if (!isMatchingPassword) {
      return done(null, false, {
        message: "Username or password is not correct",
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

passport.use(new LocalStrategy({ usernameField: "email" }, verifyCallback));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const rows = await memberRepository.findById(id);
    const user = rows[0];

    done(null, {
      id: user.id,
      firstName: user.firstname,
      lastname: user.lastname,
      email: user.email,
      status: user.status,
    });
  } catch (err) {
    done(err);
  }
});
