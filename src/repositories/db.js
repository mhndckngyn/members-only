import { Pool } from "pg";

const pool = new Pool();

function query(text, params) {
  return pool.query(text, params);
}

export default { query };
