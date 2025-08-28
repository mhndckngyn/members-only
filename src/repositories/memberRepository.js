import db from "./db.js";

const membershipStatus = {
  normal: "normal",
  secret: "secret",
  admin: "admin",
};

const memberRepository = {
  insert: async (memberInsertData) => {
    const { username, email, password } = memberInsertData;

    await db.query(
      "insert into member (username, email, password, status values ($1, $2, $3, $4)",
      [username, email, password, membershipStatus.normal]
    );
  },

  updateToSecret: async (id) => {
    await db.query("update member set status = $1 where id = $2", [
      membershipStatus.secret,
      id,
    ]);
  },

  updateToAdmin: async (id) => {
    await db.query("update member set status = $1 where id = $2", [
      membershipStatus.admin,
      id,
    ]);
  },

  findByEmail: async (email) => {
    const { rows } = await db.query("select * from member where email = $1", [
      email,
    ]);

    return rows;
  },
};

export default memberRepository;
