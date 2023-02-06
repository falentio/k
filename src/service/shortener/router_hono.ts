import { Hono, Context } from "hono"
import { ShortenerService } from "./service.ts"
import { authGuard } from "~/src/infrastructure/middleware/auth.ts"

export class ShortenerRouterHono extends Hono {
	constructor(
		private shortener: ShortenerService,
	) {
		super()
		this.get("/:id", c => this.getShortener(c))
		this.delete("/:id", authGuard, c => this.deleteShortener(c))
		this.post("/", c => this.createShortener(c))
	}

	async getShortener(c: Context) {
		const id = c.req.param("id")
		const s = await this.shortener.get(id)
		return c.json(s)
	}

	async deleteShortener(c: Context) {
		const { user } = c.get("session")
		const id = c.req.param("id")
		await this.shortener.delete(user, id)
		c.status(204)
		return c.body("ok")
	}

	async createShortener(c: Context) {
		const s = await c.req.json()
		if (c.get("session")) {
			const { user } = c.get("session")
			s.user_id = user.id
		}
		const created = await this.shortener.create(s)
		return c.json(created)
	}
}