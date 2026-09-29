// Database layer — Node's built-in SQLite (node:sqlite), zero dependencies.
// Exposes a small Prisma-compatible API so the rest of the app doesn't care.
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "crypto";

function dbPath(): string {
  const url = process.env.DATABASE_URL || "file:./dev.db";
  const m = url.match(/^file:(.+)$/);
  return m ? m[1] : "./dev.db";
}

const sqlite = new DatabaseSync(dbPath());

sqlite.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  passwordHash TEXT NOT NULL,
  isAdmin INTEGER NOT NULL DEFAULT 0,
  pledgeAcceptedAt TEXT NOT NULL,
  createdAt TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  userId TEXT NOT NULL,
  expiresAt TEXT NOT NULL,
  createdAt TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS progress (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  pathId TEXT NOT NULL,
  moduleId TEXT NOT NULL,
  lessonDone INTEGER NOT NULL DEFAULT 0,
  labDone INTEGER NOT NULL DEFAULT 0,
  quizPassed INTEGER NOT NULL DEFAULT 0,
  score INTEGER,
  objectives TEXT NOT NULL DEFAULT '{}',
  answers TEXT,
  updatedAt TEXT NOT NULL,
  UNIQUE(userId, pathId, moduleId)
);
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  pathId TEXT NOT NULL,
  pathTitle TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  issuedAt TEXT NOT NULL,
  UNIQUE(userId, pathId)
);
CREATE TABLE IF NOT EXISTS content_overrides (
  id TEXT PRIMARY KEY,
  pathId TEXT NOT NULL,
  moduleId TEXT NOT NULL,
  field TEXT NOT NULL,
  value TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  UNIQUE(pathId, moduleId, field)
);
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  moduleId TEXT,
  body TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
`);

try { sqlite.exec(`ALTER TABLE users ADD COLUMN avatar TEXT NOT NULL DEFAULT ''`); } catch { /* column exists */ }

const now = () => new Date().toISOString();
const B = (v: unknown) => (v ? 1 : 0);

// ---- row mappers ----
type Row = Record<string, unknown>;
type PV = string | number | bigint | null | Uint8Array;

function mapUser(r: Row) {
  return {
    id: r.id as string,
    name: r.name as string,
    email: r.email as string,
    passwordHash: r.passwordHash as string,
    isAdmin: (r.isAdmin as number) === 1,
    avatar: (r.avatar as string) ?? "",
    pledgeAcceptedAt: new Date(r.pledgeAcceptedAt as string),
    createdAt: new Date(r.createdAt as string),
  };
}
function mapSession(r: Row) {
  return {
    id: r.id as string,
    token: r.token as string,
    userId: r.userId as string,
    expiresAt: new Date(r.expiresAt as string),
    createdAt: new Date(r.createdAt as string),
  };
}
function mapProgress(r: Row) {
  return {
    id: r.id as string,
    userId: r.userId as string,
    pathId: r.pathId as string,
    moduleId: r.moduleId as string,
    lessonDone: (r.lessonDone as number) === 1,
    labDone: (r.labDone as number) === 1,
    quizPassed: (r.quizPassed as number) === 1,
    score: (r.score as number | null) ?? null,
    objectives: r.objectives as string,
    answers: (r.answers as string | null) ?? null,
    updatedAt: new Date(r.updatedAt as string),
  };
}
function mapCertificate(r: Row) {
  return {
    id: r.id as string,
    userId: r.userId as string,
    pathId: r.pathId as string,
    pathTitle: r.pathTitle as string,
    code: r.code as string,
    issuedAt: new Date(r.issuedAt as string),
  };
}
function mapOverride(r: Row) {
  return {
    id: r.id as string,
    pathId: r.pathId as string,
    moduleId: r.moduleId as string,
    field: r.field as string,
    value: r.value as string,
    updatedAt: new Date(r.updatedAt as string),
  };
}

// ---- users ----
const user = {
  async findUnique({ where }: { where: { id?: string; email?: string } }) {
    const r = (where.id
      ? sqlite.prepare("SELECT * FROM users WHERE id = ?").get(where.id as string)
      : sqlite.prepare("SELECT * FROM users WHERE email = ?").get(where.email as string)) as Row | undefined;
    return r ? mapUser(r) : null;
  },
  async create({ data }: { data: { name: string; email: string; passwordHash: string; isAdmin?: boolean } }) {
    const id = randomUUID();
    const t = now();
    sqlite.prepare("INSERT INTO users (id, name, email, passwordHash, isAdmin, pledgeAcceptedAt, createdAt) VALUES (?,?,?,?,?,?,?)")
      .run(id, data.name, data.email, data.passwordHash, B(data.isAdmin), t, t);
    return mapUser(sqlite.prepare("SELECT * FROM users WHERE id = ?").get(id) as Row);
  },
  async update({ where, data }: { where: { id: string }; data: { passwordHash?: string; name?: string; avatar?: string } }) {
    const sets: string[] = [];
    const vals: PV[] = [];
    if (data.passwordHash !== undefined) { sets.push("passwordHash = ?"); vals.push(data.passwordHash); }
    if (data.name !== undefined) { sets.push("name = ?"); vals.push(data.name); }
    if (data.avatar !== undefined) { sets.push("avatar = ?"); vals.push(data.avatar); }
    if (sets.length) sqlite.prepare(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`).run(...vals, where.id);
    return this.findUnique({ where });
  },
};

// ---- sessions ----
type SessionRow = ReturnType<typeof mapSession>;
type UserRow = ReturnType<typeof mapUser>;
type SessionWithUser = SessionRow & { user: UserRow };
type CertificateRow = ReturnType<typeof mapCertificate>;
type CertificateWithUser = CertificateRow & { user: UserRow };

async function sessionFindUnique(args: { where: { id?: string; token?: string }; include: { user: true } }): Promise<SessionWithUser | null>;
async function sessionFindUnique(args: { where: { id?: string; token?: string }; include?: undefined }): Promise<SessionRow | null>;
async function sessionFindUnique({ where, include }: { where: { id?: string; token?: string }; include?: { user?: boolean } }) {
  const r = (where.token
    ? sqlite.prepare("SELECT * FROM sessions WHERE token = ?").get(where.token as string)
    : sqlite.prepare("SELECT * FROM sessions WHERE id = ?").get(where.id as string)) as Row | undefined;
  if (!r) return null;
  const s = mapSession(r);
  if (include?.user) {
    const u = (await user.findUnique({ where: { id: s.userId } }))!;
    return { ...s, user: u };
  }
  return s;
}

const session = {
  findUnique: sessionFindUnique,
  async create({ data }: { data: { token: string; userId: string; expiresAt: Date | string } }) {
    const id = randomUUID();
    sqlite.prepare("INSERT INTO sessions (id, token, userId, expiresAt, createdAt) VALUES (?,?,?,?,?)")
      .run(id, data.token, data.userId, new Date(data.expiresAt as string | Date).toISOString(), now());
    return mapSession(sqlite.prepare("SELECT * FROM sessions WHERE id = ?").get(id) as Row);
  },
  async delete({ where }: { where: { id?: string; token?: string } }) {
    if (where.token) sqlite.prepare("DELETE FROM sessions WHERE token = ?").run(where.token);
    else sqlite.prepare("DELETE FROM sessions WHERE id = ?").run(where.id as string);
  },
  async deleteMany({ where }: { where: { token?: string; userId?: string; expiresAt?: { lt: Date } } }) {
    if (where.token) sqlite.prepare("DELETE FROM sessions WHERE token = ?").run(where.token);
    else if (where.userId && where.expiresAt) sqlite.prepare("DELETE FROM sessions WHERE userId = ? AND expiresAt < ?").run(where.userId, where.expiresAt.lt.toISOString());
    else if (where.userId) sqlite.prepare("DELETE FROM sessions WHERE userId = ?").run(where.userId);
  },
};

// ---- progress ----
const progress = {
  async findUnique({ where }: { where: { userId_pathId_moduleId: { userId: string; pathId: string; moduleId: string } } }) {
    const k = where.userId_pathId_moduleId;
    const r = sqlite.prepare("SELECT * FROM progress WHERE userId = ? AND pathId = ? AND moduleId = ?").get(k.userId, k.pathId, k.moduleId) as Row | undefined;
    return r ? mapProgress(r) : null;
  },
  async findMany({ where, orderBy }: { where: { userId?: string; pathId?: string }; orderBy?: { updatedAt: "desc" | "asc" } }) {
    const conds: string[] = [];
    const vals: PV[] = [];
    if (where.userId) { conds.push("userId = ?"); vals.push(where.userId); }
    if (where.pathId) { conds.push("pathId = ?"); vals.push(where.pathId); }
    const order = orderBy?.updatedAt === "asc" ? "ASC" : "DESC";
    const rows = sqlite.prepare(`SELECT * FROM progress ${conds.length ? "WHERE " + conds.join(" AND ") : ""} ORDER BY updatedAt ${order}`).all(...vals) as Row[];
    return rows.map(mapProgress);
  },
  async create({ data }: { data: { userId: string; pathId: string; moduleId: string } }) {
    const id = randomUUID();
    sqlite.prepare("INSERT INTO progress (id, userId, pathId, moduleId, updatedAt) VALUES (?,?,?,?,?)")
      .run(id, data.userId, data.pathId, data.moduleId, now());
    return mapProgress(sqlite.prepare("SELECT * FROM progress WHERE id = ?").get(id) as Row);
  },
  async update({ where, data }: {
    where: { userId_pathId_moduleId: { userId: string; pathId: string; moduleId: string } };
    data: { lessonDone?: boolean; labDone?: boolean; quizPassed?: boolean; score?: number; objectives?: string; answers?: string };
  }) {
    const k = where.userId_pathId_moduleId;
    const sets: string[] = ["updatedAt = ?"];
    const vals: PV[] = [now()];
    if (data.lessonDone !== undefined) { sets.push("lessonDone = ?"); vals.push(B(data.lessonDone)); }
    if (data.labDone !== undefined) { sets.push("labDone = ?"); vals.push(B(data.labDone)); }
    if (data.quizPassed !== undefined) { sets.push("quizPassed = ?"); vals.push(B(data.quizPassed)); }
    if (data.score !== undefined) { sets.push("score = ?"); vals.push(data.score); }
    if (data.objectives !== undefined) { sets.push("objectives = ?"); vals.push(data.objectives); }
    if (data.answers !== undefined) { sets.push("answers = ?"); vals.push(data.answers); }
    sqlite.prepare(`UPDATE progress SET ${sets.join(", ")} WHERE userId = ? AND pathId = ? AND moduleId = ?`).run(...vals, k.userId, k.pathId, k.moduleId);
    return this.findUnique({ where });
  },
};

// ---- certificates ----
async function certificateFindUnique(args: { where: { code?: string; userId_pathId?: { userId: string; pathId: string } }; include: { user: true } }): Promise<CertificateWithUser | null>;
async function certificateFindUnique(args: { where: { code?: string; userId_pathId?: { userId: string; pathId: string } }; include?: undefined }): Promise<CertificateRow | null>;
async function certificateFindUnique({ where, include }: { where: { code?: string; userId_pathId?: { userId: string; pathId: string } }; include?: { user?: boolean } }) {
  const r = (where.code
    ? sqlite.prepare("SELECT * FROM certificates WHERE code = ?").get(where.code)
    : sqlite.prepare("SELECT * FROM certificates WHERE userId = ? AND pathId = ?").get(where.userId_pathId!.userId, where.userId_pathId!.pathId)) as Row | undefined;
  if (!r) return null;
  const c = mapCertificate(r);
  if (include?.user) {
    const u = (await user.findUnique({ where: { id: c.userId } }))!;
    return { ...c, user: u };
  }
  return c;
}

const certificate = {
  findUnique: certificateFindUnique,
  async findMany({ where, orderBy }: { where: { userId?: string }; orderBy?: { issuedAt: "desc" | "asc" } }) {
    const order = orderBy?.issuedAt === "asc" ? "ASC" : "DESC";
    const rows = (where.userId
      ? sqlite.prepare(`SELECT * FROM certificates WHERE userId = ? ORDER BY issuedAt ${order}`).all(where.userId)
      : sqlite.prepare(`SELECT * FROM certificates ORDER BY issuedAt ${order}`).all()) as Row[];
    return rows.map(mapCertificate);
  },
  async create({ data }: { data: { code: string; userId: string; pathId: string; pathTitle: string } }) {
    const id = randomUUID();
    sqlite.prepare("INSERT INTO certificates (id, userId, pathId, pathTitle, code, issuedAt) VALUES (?,?,?,?,?,?)")
      .run(id, data.userId, data.pathId, data.pathTitle, data.code, now());
    return mapCertificate(sqlite.prepare("SELECT * FROM certificates WHERE id = ?").get(id) as Row);
  },
};

// ---- content overrides ----
const contentOverride = {
  async findMany({ where }: { where: { pathId?: string } }) {
    const rows = (where.pathId
      ? sqlite.prepare("SELECT * FROM content_overrides WHERE pathId = ?").all(where.pathId)
      : sqlite.prepare("SELECT * FROM content_overrides").all()) as Row[];
    return rows.map(mapOverride);
  },
  async upsert({ where, update, create }: {
    where: { pathId_moduleId_field: { pathId: string; moduleId: string; field: string } };
    update: { value: string };
    create: { pathId: string; moduleId: string; field: string; value: string };
  }) {
    const k = where.pathId_moduleId_field;
    const existing = sqlite.prepare("SELECT id FROM content_overrides WHERE pathId = ? AND moduleId = ? AND field = ?").get(k.pathId, k.moduleId, k.field) as Row | undefined;
    if (existing) {
      sqlite.prepare("UPDATE content_overrides SET value = ?, updatedAt = ? WHERE id = ?").run(update.value, now(), existing.id as string);
    } else {
      sqlite.prepare("INSERT INTO content_overrides (id, pathId, moduleId, field, value, updatedAt) VALUES (?,?,?,?,?,?)")
        .run(randomUUID(), create.pathId, create.moduleId, create.field, create.value, now());
    }
  },
  async deleteMany({ where }: { where: { pathId: string; moduleId: string; field: string } }) {
    sqlite.prepare("DELETE FROM content_overrides WHERE pathId = ? AND moduleId = ? AND field = ?").run(where.pathId, where.moduleId, where.field);
  },
};

// ---- notes (for the field journal; future server sync) ----
const note = {
  async create({ data }: { data: { userId: string; moduleId?: string; body: string } }) {
    const id = randomUUID();
    const t = now();
    sqlite.prepare("INSERT INTO notes (id, userId, moduleId, body, createdAt, updatedAt) VALUES (?,?,?,?,?,?)")
      .run(id, data.userId, data.moduleId ?? null, data.body, t, t);
    return { id, ...data, createdAt: new Date(t), updatedAt: new Date(t) };
  },
};

export const db = { user, session, progress, certificate, contentOverride, note };
