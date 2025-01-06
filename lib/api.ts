import axios from "axios";
import { Key, PaginatedResponse, FilterParams } from "@/types";

const BASE_URL = "http://localhost:8000";

export const api = {
	// Keys
	getKeys: async (params: FilterParams): Promise<PaginatedResponse<Key>> => {
		const { data } = await axios.get(`${BASE_URL}/keys`, { params });
		return data;
	},

	getKey: async (id: number): Promise<Key> => {
		const { data } = await axios.get(`${BASE_URL}/keys/${id}`);
		return data;
	},

	createKey: async (key: Omit<Key, "id">): Promise<Key> => {
		const { data } = await axios.post(`${BASE_URL}/keys`, key);
		return data;
	},

	updateKey: async (id: number, key: Partial<Key>): Promise<Key> => {
		const { data } = await axios.put(`${BASE_URL}/keys/${id}`, key);
		return data;
	},

	deleteKey: async (id: number): Promise<void> => {
		await axios.delete(`${BASE_URL}/keys/${id}`);
	},

	// Additional methods for dialog interaction (if needed in future)
};
