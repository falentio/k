import type { Context } from "hono"
import { ZodError } from "zod"

export class ResponseError extends Error {
	status: number
	constructor(message: string, status = 500) {
		super(message)
		this.status = status
	}
}

export const errorHandler = (err: unknown, c: Context) => {
	if (err instanceof ResponseError) {
		c.status(err.status)
		if (err.status > 500) {
			return c.body("Internal Server Error")
		}
		return c.body(err)
	}
	if (err instanceof ZodError) {
		const msg = e.issues[0].message
		c.status(400)
		return c.body({ message: msg })
	}

	console.error(err)
	c.status(500)
	return c.body("Internal Server Error")
}