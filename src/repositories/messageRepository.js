import { query } from "./db.js";

const messageRepository = {
  getAll: async () => {
    const { rows } = await query(
      "select m.id as id, m.title as title, m.content as content, m.time as time, concat(member.firstname, ' ', member.lastname) as member from message m join member on m.member_id = member.id order by m.time desc"
    );

    return rows;
  },

  insert: async (messageInsertData) => {
    const { title, content, memberId } = messageInsertData;

    await query(
      "insert into message (title, content, member_id) values ($1, $2, $3)",
      [title, content, memberId]
    );
  },

  delete: async (id) => {
    await query("delete from message where id = $1", [id]);
  },
};

export default messageRepository;
