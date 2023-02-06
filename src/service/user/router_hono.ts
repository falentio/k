import { Context, Hono } from "hono";
import { UserService } from "./service.ts";
import { ResponseError } from "~/src/infrastructure/response/response.ts";

export class UserRouterHono extends Hono {
  constructor(
    private userService: UserService,
  ) {
    super();
    this.post("/login", (c) => this.loginUser(c));
    this.get("/list", (c) => this.listUser(c));
    this.get("/count", (c) => this.countAll(c));
    this.get("/", (c) => this.getUser(c));
    this.delete("/", (c) => this.deleteUser(c));
    this.put("/", (c) => this.updateUser(c));
    this.post("/", (c) => this.createUser(c));
  }

  async loginUser(c: Context) {
    const user = await c.req.json();
    const { accessToken } = await this.userService.login(user);
    c.cookie("session_token", accessToken, {
      path: "/",
    });
    return c.json({ accessToken });
  }

  async getUser(c: Context) {
    const { aud: username } = c.get("session");
    const user = await this.userService.get(username);
    return c.json(user);
  }

  async deleteUser(c: Context) {
    const { aud: username } = c.get("session");
    await this.userService.delete(username);
    c.status(204);
    return c.body("");
  }

  async updateUser(c: Context) {
    const { user: u } = c.get("session");
    const user = await c.req.json();
    if (u.level !== "admin") {
      user.username = u.username;
    }
    const updated = await this.userService.update(user);
    return c.json(updated);
  }

  async createUser(c: Context) {
    const user = await c.req.json();
    const created = await this.userService.create(user);
    const { accessToken } = await this.userService.login(user);
    c.cookie("session_token", accessToken, {
      path: "/",
    });
    return c.json(created);
  }

  async listUser(c: Context) {
    const { user } = c.get("session");
    if (user.level !== "admin") {
      throw new ResponseError("forbidden", 403);
    }
    const page = +(c.req.query("page") || "1");
    const users = await this.userService.list(page);
    return c.json(users);
  }

  async countAll(c: Context) {
    const count = await this.userService.countAll();
    return c.json({ count });
  }
}
