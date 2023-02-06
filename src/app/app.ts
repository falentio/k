import postgres from "postgresjs";
import { Repository } from "~/src/interface/interface.ts";
import {
  errorHandler,
  ResponseError,
} from "~/src/infrastructure/response/response.ts";
import {
  UserRepositoryPg,
  UserRouterHono,
  UserService,
} from "~/src/service/user/user.ts";
import {
  ShortenerClickRepositoryPg,
  ShortenerRepositoryPg,
  ShortenerRouterHono,
  ShortenerService,
} from "~/src/service/shortener/shortener.ts";
import { Hono } from "hono";
import { getCookies } from "std/http/mod.ts";
import { decode, verify } from "djwt";

export const key = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(Deno.env.get("JWT_SECRET")),
  { name: "HMAC", hash: "SHA-512" },
  false,
  ["sign", "verify"],
);
const repository = setupRepository();
export const userService = new UserService(key, repository.userRepository);
export const shortenerService = new ShortenerService(
  repository.shortenerRepository,
  repository.shortenerClickRepository,
);

const api = new Hono();
api.route("/user", new UserRouterHono(userService));
api.route("/shortener", new ShortenerRouterHono(shortenerService));

export const app = new Hono();
app.onError(errorHandler);
app.use("*", async (c, next) => {
  const id = crypto.randomUUID();
  c.set("req-id", id);
  c.header("x-req-id", id);
  await next();
});
app.use("*", async (c, next) => {
  if (new URL(c.req.url).pathname === "/api/user/login") {
    return next();
  }
  const cookies = getCookies(c.req.headers);
  const token = c.req.headers.get("Authorization")?.slice(7) ||
    cookies.session_token;
  if (!token) {
    return next();
  }

  try {
    await verify(token, key);
    const [, payload] = decode(token);
    c.set("session", payload);
  } finally {
    return next();
  }
});
app.use("*", async (c, next) => {
  const session = c.get("session");
  const { pathname } = new URL(c.req.url);
  const ua = c.req.headers.get("user-agent");
  const cookies = getCookies(c.req.headers);
  const reqId = c.get("req-id");
  console.log({ pathname, session, ua, cookies, reqId });
  await next();
});
app.route("/api", api);

function setupRepository(): Repository {
  switch (Deno.env.get("REPOSITORY_DRIVER")) {
    case "pg":
    default:
      const dsn = Deno.env.get("DATABASE_DSN");
      const sql = postgres(dsn, {
        ssl: { rejectUnauthorized: false },
      });
      return {
        userRepository: new UserRepositoryPg(sql),
        shortenerRepository: new ShortenerRepositoryPg(sql),
        shortenerClickRepository: new ShortenerClickRepositoryPg(sql),
      };
  }
}
