import { User, UserRepository } from "../../interface/interface.ts";
import { compareSync, hashSync } from "bcrypt";
import { create, getNumericDate } from "djwt";
import { setCookie } from "std/http/mod.ts";
import { z, ZodError } from "zod";
import { ResponseError } from "~/src/infrastructure/response/response.ts";

const userCreateSchema = z.object({
  username: z.string().max(32),
  password: z.string().min(8),
});

const userUpdateSchema = z.object({
  username: z.string().max(32),
  password: z.string().min(8).optional(),
});

export class UserService {
  constructor(
    private key: CryptoKey,
    private repository: UserRepository,
  ) {}

  async create(user: Partial<User>) {
    await userCreateSchema.parseAsync(user);
    user.password = hashSync(user.password);

    const created = await this.repository.create(user);
    created.password = "";
    return created;
  }

  async update(user: Partial<User>) {
    await userUpdateSchema.parseAsync(user);
    if (user.password) {
      user.password = hashSync(user.password);
    }

    const updated = await this.repository.update(user);
    updated.password = "";
    return updated;
  }

  async delete(username: string) {
    await this.repository.delete(username);
    return null;
  }

  async get(username: string) {
    const stored = await this.repository.get(username);
    stored.password = "";
    return stored;
  }

  async login(user: Partial<User>) {
    await userCreateSchema.parseAsync(user);
    const stored = await this.repository.get(user.username);

    if (!compareSync(user.password, stored.password)) {
      throw new ResponseError("missmatch password", 400);
    }
    await this.repository.login(user.username);

    stored.password = "";
    const accessToken = await create(
      { alg: "HS512", typ: "JWT" },
      {
        aud: user.username,
        iss: "k.falentio.com",
        jti: crypto.randomUUID(),
        exp: getNumericDate(60 * 60 * 4),
        iat: getNumericDate(0),
        user: stored,
      },
      this.key,
    );

    return { accessToken };
  }

  async list(page: number) {
    page = Math.max(page, 1);
    const limit = 20;
    const offset = (page - 1) * limit;
    const list = await this.repository.list(offset, limit);
    for (const u of list) {
      delete u.password;
    }
    return list;
  }

  async countAll() {
    return this.repository.countAll();
  }
}
