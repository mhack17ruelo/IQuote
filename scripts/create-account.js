import { DatabaseSync } from 'node:sqlite';
import { randomBytes, scryptSync } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [inputEmail, company] = process.argv.slice(2);
const email = String(inputEmail || '').trim().toLowerCase();

if (!/^\S+@\S+\.\S+$/.test(email) || !company?.trim()) {
  console.error('Usage: npm run create-account -- user@example.com "Company Name"');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data');
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const database = new DatabaseSync(path.join(dataDir, 'ruelo.sqlite'));
database.exec(`CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  company TEXT NOT NULL,
  created_at TEXT NOT NULL
)`);

if (database.prepare('SELECT id FROM users WHERE email=?').get(email)) {
  database.close();
  console.error(`An account already exists for ${email}.`);
  process.exit(1);
}

const password = randomBytes(24).toString('base64url');
const salt = randomBytes(16).toString('hex');
database.prepare('INSERT INTO users(email,password_hash,salt,company,created_at) VALUES(?,?,?,?,?)')
  .run(email, scryptSync(password, salt, 64).toString('hex'), salt, company.trim(), new Date().toISOString());
database.close();

console.log(`Account created for ${email}.`);
console.log(`One-time password: ${password}`);
console.log('Share this password privately. Password recovery requires SMTP to be configured.');
