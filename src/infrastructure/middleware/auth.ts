import { Context } from "hono";
import { ResponseError } from "~/src/infrastructure/response/response.ts";

export const authGuard = (c: Context, next: () => Promise<Response>) => {
  if (!c.get("session")) {
    throw new ResponseError("unauthorized", 401);
  }
  return next();
};
