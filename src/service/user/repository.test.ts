import { UserRepositoryPg } from "./repository_pg.ts"
import { UserRepository, User } from "../../interface/interface.ts"
import { sql } from "../../testing/testing.ts"
import { assertEquals } from "std/testing/asserts.ts"

const repository = [
	["postgres", new UserRepositoryPg(sql)],
] as UserRepository[]

Deno.test("user_repository", { sanitizeOps: false, sanitizeResources: false }, async (t) => {
	const p = repository.map(([name, r]) => repositoryTest(t, name, r))
	await Promise.all(p)
})

function repositoryTest(t: Deno.TestContext, name: string, r: UserRepository) {
	return t.step(name, async () => {
		const username = Math.random().toString(36)
		const c = await r.countAll()
		const created = await r.create({
			username,
			password: Math.random().toString(36),
		})

		assertEquals(c + 1, await r.countAll())
		assertEquals(
			created,
			await r.get(username)
		)

		const updated = await r.update({
			username,
			password: Math.random().toString(36),
		})

		assertEquals(c + 1, await r.countAll())
		assertEquals(
			updated,
			await r.get(username)
		)
	})
}