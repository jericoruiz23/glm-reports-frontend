import api from "./api";

const catalogService = {
    list: () => api.get("/api/catalogos/list"),
    listOptions: () => api.get("/api/catalogos"),
    getById: (catalogId) => api.get(`/api/catalogos/${catalogId}`),
    addValue: (catalogId, payload) => api.post(`/api/catalogos/${catalogId}/valor`, payload),
    removeValue: (catalogType, key) => api.del(`/api/catalogos/${catalogType}/valor/${key}`),
};

export default catalogService;
