import type { User, Shortener, ShortenerClick } from "./model.ts"

export interface UserRepository {
	create(user: Partial<User>): Promise<User>
	update(user: Partial<User>): Promise<User>
	delete(username: string): Promise<void>
	login(username: string): Promise<void>
	get(username: string): Promise<User | undefined>
	countAll(): Promise<number>
	list(offset: number, limit: number): Promise<User[]>
}

export interface ShortenerRepository {
	create(s: Partial<Shortener>): Promise<Shortener>
	delete(id: string): Promise<void>
	get(id: string): Promise<Shortener | undefined>
	list(user: number, offset: number, limit: number): Promise<Shortener[]>
	count(user: number): Promise<number>
	countAll(): Promise<number>
}

export interface ShortenerClickRepository {
	create(id: string): Promise<ShortenerClick>
	count(id: string): Promise<number>
}

export interface Repository {
	userRepository: UserRepository
	shortenerRepository: ShortenerRepository
	shortenerClickRepository: ShortenerClickRepository
}