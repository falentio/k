import { z } from "zod"
import { ShortenerRepository, Shortener, ShortenerClickRepository, ShortenerClick, User } from "../../interface/interface.ts"

const shortenerCreateSchema = z.object({
	slug: z.string().min(4).max(256).optional(),
	target: z.string().url().min(4).max(2024),
})

export class ShortenerService {
	constructor(
		private shortenerRepository: ShortenerRepository,
		private shortenerClickRepository: ShortenerClickRepository,
	) {}

	private generateSlug() {
		const consonant = "bcdfghjklmnpqrstvwxyz"
		const vowel = "aiueo"
		let result = ""
		let i = Math.random() * 100 | 0
		while (result.length < 8) {
			const c = [consonant, vowel][i++ % 2 | 0]
			result += c[Math.random() * c.length | 0]
		}
		return result
	}

	async get(id: string, visitor: string) {
		const s = await this.shortenerRepository.get(id)
		await this.shortenerClickRepository.create(id)
		return s
	}

	async delete(user: User, id: string) {
		if (user.level !== "admin") {
			await this.shortenerRepository.delete(id)
		} else {
			await this.shortenerRepository.deleteSoft(id, user.id)
		}
	}

	async create(s: Partial<Shortener>) {
		s.slug ||= this.generateSlug()
		await shortenerCreateSchema.parseAsync(s)
		const created = await this.shortenerRepository.create(s)
		return created
	}

	async list(user: number, page = 1) {
		page = Math.max(page, 1)
		const limit = 20
		const offset = (page - 1) * limit

		return this.shortenerRepository.list(user, offset, limit)
	}
}