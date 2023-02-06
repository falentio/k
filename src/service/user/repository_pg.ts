import postgres from "postgresjs"

import { UserRepository, User } from "../../interface/interface.ts"

export class UserRepositoryPg implements UserRepository {
	sql: postgres.Sql

	constructor(sql: postgres.Sql) {
		this.sql = sql
	}

	async create(user: Partial<User>) {
		const [created]: [User] = await this.sql`
			insert into app_user
			${this.sql(user, "username", "password")}
			returning *
		`

		return created
	}

	async update(user: Partial<User>) {
		const [updated]: [User] = await this.sql`
			update app_user set
			updated_at = NOW(),
			${this.sql(user, "password")}
			where username = ${user.username}
			returning *
		`

		return updated
	}

	async get(username: string) {
		const [user]: [User] = await this.sql`
			select * from app_user where username = ${username}
		`
		return user
	}

	async delete(username: string) {
		await this.sql`delete from app_user where username = ${username}`
	}

	async countAll() {
		const [{ count }]: [{ count: string }] = await this.sql`
			select count(*) from app_user;
		`

		return parseInt(count)
	}

	async login(username: string) {
		await this.sql`update app_user set last_login = now() where username = ${username}`
	}

	list(offset: number, limit: number) {
		return this.sql<User[]>`
			select * from app_user order by id 
			limit ${limit}
			offset ${offset}
		`
	}
}