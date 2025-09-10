import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Create axios instance with default config
const api = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor
api.interceptors.request.use(
	(config) => {
		// Add admin key if available
		const adminKey =
			typeof window !== "undefined"
				? localStorage.getItem("admin-key")
				: null;
		if (adminKey) {
			config.headers["x-admin-key"] = adminKey;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Handle unauthorized access
			console.error("Unauthorized access");
		}
		return Promise.reject(error);
	}
);

// Lead API functions
export const leadAPI = {
	// Create a new lead
	create: async (leadData: {
		name: string;
		email: string;
		phone: string;
		city?: string;
		loanAmount?: number;
		source?: string;
	}) => {
		const response = await api.post("/api/leads", leadData);
		return response.data;
	},

	// Get all leads (admin only)
	getAll: async () => {
		const response = await api.get("/api/leads");
		return response.data;
	},

	// Toggle done status of a lead
	toggleDone: async (leadId: string, done: boolean) => {
		const response = await api.patch("/api/leads", { leadId, done });
		return response.data;
	},

	// Delete a lead (admin only)
	delete: async (leadId: string) => {
		const response = await api.delete("/api/leads", { data: { leadId } });
		return response.data;
	},

	// Delete all leads (admin only)
	deleteAll: async () => {
		const response = await api.delete("/api/leads", {
			data: { deleteAll: true },
		});
		return response.data;
	},
};

export default api;
