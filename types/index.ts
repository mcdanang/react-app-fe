// types/index.ts

export interface Key {
	id: number;
	name: string;
	description: string;
	staff_id: number | null;
}

export interface Staff {
	id: number;
	name: string;
	role: string;
}

export interface KeyCopy {
	id: number;
	key_id: number;
	staff_id: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export interface FilterParams {
	page: number;
	pageSize: number;
	name?: string;
}
