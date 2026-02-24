import api from "./api";

const usersService = {
    list: () => api.get("/api/users"),
    getById: (id) => api.get(`/api/users/${id}`),
    create: (payload) => api.post("/api/users", payload),
    update: (id, payload) => api.put(`/api/users/${id}`, payload),
    remove: (id) => api.del(`/api/users/${id}`),
};

export default usersService;
