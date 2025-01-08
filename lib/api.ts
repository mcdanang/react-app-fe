import axios from "axios";
import { Key, PaginatedResponse, FilterParams, KeyCopy, Staff } from "@/types";

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

	createKey: async (key: Partial<Key>): Promise<Key> => {
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

	// Key Copies
	getKeyCopies: async (params: FilterParams): Promise<PaginatedResponse<KeyCopy>> => {
		const { data } = await axios.get(`${BASE_URL}/key-copies`, { params });
		console.log("Data", data);
		return data;
	},

	createKeyCopy: async (keyCopy: Partial<KeyCopy>): Promise<KeyCopy> => {
		const { data } = await axios.post(`${BASE_URL}/key-copies`, keyCopy);
		return data;
	},

	updateKeyCopy: async (id: number, keyCopy: Partial<KeyCopy>): Promise<KeyCopy> => {
		const { data } = await axios.put(`${BASE_URL}/key-copies/${id}`, keyCopy);
		return data;
	},

	deleteKeyCopy: async (id: number): Promise<void> => {
		await axios.delete(`${BASE_URL}/key-copies/${id}`);
	},

	// Staff
	getStaff: async (params: FilterParams): Promise<PaginatedResponse<Staff>> => {
		const { data } = await axios.get(`${BASE_URL}/staffs`, { params });
		return data;
	},

	createStaff: async (staff: Partial<Staff>): Promise<Staff> => {
		const { data } = await axios.post(`${BASE_URL}/staffs`, staff);
		return data;
	},

	updateStaff: async (id: number, staff: Partial<Staff>): Promise<Staff> => {
		const { data } = await axios.put(`${BASE_URL}/staffs/${id}`, staff);
		return data;
	},

	deleteStaff: async (id: number): Promise<void> => {
		await axios.delete(`${BASE_URL}/staffs/${id}`);
	},
};
