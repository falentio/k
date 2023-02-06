export interface User {
	created_at: Date
	updated_at: Date

	id: number
	username: string
	password: string

	shorteners?: Shortener[]
}

export interface Shortener {
	user_id: number
	created_at: Date
	updated_at: Date

	slug: string
	target: string

	user?: User
	clicks?: ShortenerClick[]
	click_count?: number
	click_by_date?: {
		date: Date,
		count: number
	}[]
}

export interface ShortenerClick {
	shoretener_id: string
	created_at: Date

	shortener?: Shortener
}