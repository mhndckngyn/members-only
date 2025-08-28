import db from "./db.js";

const messageRepository = {
  getAll: async () => {
    const { rows } = await db.query(
      "select message.id as messageId, message.title as messageTitle, message.content messageContent, message.time messageTime, member.firstname + member.lastname as from message join member on message.member_id = member.id"
    );

    return rows;
  },

  insert: async (messageInsertData) => {
    const { title, content, memberId } = messageInsertData;

    await db.query(
      "insert into message (title, content, member_id) values ($1, $2, $3",
      [title, content, memberId]
    );
  },

  delete: async (id) => {
    await db.query("delete from message where id = $1", [id]);
  },
};

export default messageRepository;
