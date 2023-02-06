import postgres from "postgresjs";

import {
  Shortener,
  ShortenerClick,
  ShortenerClickRepository,
  ShortenerRepository,
} from "../../interface/interface.ts";

export class ShortenerRepositoryPg implements ShortenerRepository {
  sql: postgres.Sql;

  constructor(sql: postgres.Sql) {
    this.sql = sql;
  }

  async create(s: Partial<Shortener>) {
    const [created]: [Shortener] = await this.sql`
			insert into shortener
			${this.sql(s, "slug", "target")}
			returning *
		`;

    return created;
  }

  async delete(slug: string) {
    await this.sql`delete from shortener where slug = ${slug}`;
  }

  async deleteSoft(slug: string, user: number) {
    await this
      .sql`delete from shortener where slug = ${slug} and user_id = ${user}`;
  }

  async get(slug: string) {
    const [stored]: [Shortener] = await this.sql`
			select 
				shortener.*,
				(select count(*) from shortener_click where shortener_id = shortener.slug) as click_count
			from shortener
			where slug = ${slug}
		`;

    stored.click_by_date = await this.sql`
			select
				date_trunc('day', created_at) as date,
				count(*) as count
			from shortener_click
			where shortener_id = ${slug}
			  and created_at > current_date - interval '1' month
			  and created_at <= current_date
			group by date_trunc('day', created_at)
		`;

    return stored;
  }

  async list(user: number, offset: number, limit: number) {
    const list: Shortener[] = await this.sql`
			select 
				shortener.*,
				(select count(*) from shortener_click where shortener_id = shortener.slug) as click_count
			from shortener
			where user_id = ${user}
			order by created_at
			limit ${limit}
			offset ${offset}
		`;

    return list;
  }

  async count(user: number) {
    const [{ count }] = await this.sql`
			select
				count(*) as count
			from shortener
			where user_id = ${user}
		`;

    return count;
  }

  async countAll() {
    const [{ count }] = await this.sql`
			select
				count(*) as count
			from shortener
		`;

    return count;
  }
}

export class ShortenerClickRepositoryPg implements ShortenerClickRepository {
  sql: postgres.Sql;

  constructor(sql: postgres.Sql) {
    this.sql = sql;
  }

  async create(slug: string) {
    const [created]: [ShortenerClick] = await this.sql`
			insert into shortener_click(shortener_id) values(${slug})
		`;

    return created;
  }

  async count(slug: string) {
    const [{ count }] = await this.sql`
			select
				count(*) as count
			from shortener_click
			where shortener_id = ${slug}
		`;

    return count;
  }
}
