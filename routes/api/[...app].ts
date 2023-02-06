import { app } from "~/src/app/app.ts";
import { HandlerContext } from "$fresh/server.ts";

export const handler = (req: Request, _ctx: HandlerContext): Response => {
  return app.fetch(req);
};
