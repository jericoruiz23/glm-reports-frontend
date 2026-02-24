import api from "./api";

const processService = {
    list: () => api.get("/api/process"),
    getById: (id) => api.get(`/api/process/${id}`),
    create: (payload) => api.post("/api/process", payload),
    update: (id, payload) => api.put(`/api/process/${id}`, payload),
    remove: (id) => api.del(`/api/process/${id}`),
};

export default processService;
