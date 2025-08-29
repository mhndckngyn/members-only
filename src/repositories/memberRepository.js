import { query } from "./db.js";

const membershipStatus = {
  normal: "normal",
  secret: "secret",
  admin: "admin",
};

const memberRepository = {
  insert: async (memberInsertData) => {
    const { firstName, lastName, email, password } = memberInsertData;

    const { rows } = await query(
      "insert into member (firstname, lastname, email, password, status) values ($1, $2, $3, $4, $5) returning id",
      [firstName, lastName, email, password, membershipStatus.normal]
    );

    return rows;
  },

  updateToSecret: async (id) => {
    await query("update member set status = $1 where id = $2", [
      membershipStatus.secret,
      id,
    ]);
  },

  updateToAdmin: async (id) => {
    await query("update member set status = $1 where id = $2", [
      membershipStatus.admin,
      id,
    ]);
  },

  findByEmail: async (email) => {
    const { rows } = await query("select * from member where email = $1", [
      email,
    ]);

    return rows;
  },

  findById: async (id) => {
    const { rows } = await query("select * from member where id = $1", [id]);
    return rows;
  },
};

export default memberRepository;
