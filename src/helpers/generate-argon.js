import * as argon2 from 'argon2';

const hash = await argon2.hash("random string");
console.log(hash);
