import { hashSync, genSaltSync } from "bcrypt";


const salt = genSaltSync(10);
const salt2 = genSaltSync(10);
console.log(salt, salt2);
const password = "aaa";
const saltLength = salt.length;
const hash = hashSync(password, salt);
const hash2 = hashSync(password, salt2);

console.log(hash, hash2);

console.log('login: ', password);
const getSalt1 = hash.slice(0, saltLength);
const getSalt2 = hash2.slice(0, saltLength);

const newHash1 = hashSync(password, getSalt1);
const newHash2 = hashSync(password, getSalt2);

console.log(newHash1, newHash2);