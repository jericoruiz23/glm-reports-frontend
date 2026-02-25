import api from "./api";

const extractPageData = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.data)) return res.data.data;
    if (Array.isArray(res?.results)) return res.results;
    return [];
};

const extractTotalPages = (res) => {
    if (Array.isArray(res)) return 1;
    const totalPages = res?.totalPages ?? res?.data?.totalPages ?? 1;
    const parsed = Number(totalPages);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const processService = {
    /**
     * Lista procesos con soporte de paginación y filtros.
     * El backend devuelve { data: [...], page, limit, total, totalPages, ... }
     * @param {Object} params - Filtros opcionales: processType, estado, from, to, page, limit
     */
    list: async (params = {}) => {
        const qs = new URLSearchParams(
            Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ""))
        ).toString();
        const endpoint = `/api/process${qs ? `?${qs}` : ""}`;
        console.log("[processService.list] request", { params, endpoint });
        const response = await api.get(endpoint);
        console.log("[processService.list] response", response);
        return response;
    },

    /**
     * Trae todos los procesos paginando automaticamente.
     * Respeta el maximo del backend (100 por pagina).
     */
    listAll: async (params = {}) => {
        const pageSize = 100;
        let page = 1;
        let totalPages = 1;
        const allProcesses = [];

        while (page <= totalPages) {
            const res = await processService.list({ ...params, page, limit: pageSize });

            const pageData = extractPageData(res);
            allProcesses.push(...pageData);

            totalPages = extractTotalPages(res);
            console.log("[processService.listAll] page summary", {
                page,
                totalPages,
                pageItems: pageData.length,
                accumulated: allProcesses.length,
                responseKeys: res && typeof res === "object" ? Object.keys(res) : typeof res,
            });

            if (pageData.length === 0) break;
            page += 1;
        }

        console.log("[processService.listAll] total registros", allProcesses.length);
        return allProcesses;
    },

    getById: (id) => api.get(`/api/process/${id}`),
    create: (payload) => api.post("/api/process", payload),
    update: (id, payload) => api.put(`/api/process/${id}`, payload),
    remove: (id) => api.del(`/api/process/${id}`),
    anular: (id) => api.put(`/api/process/${id}/anular`),
    updateStage: (id, stage, payload) => api.patch(`/api/process/${id}/${stage}`, payload),
    deleteItem: (id, codigo) => api.del(`/api/process/${id}/items/${codigo}`),

    /** Obtiene métricas materializadas de un proceso */
    getMetrics: (id) => api.get(`/api/process/${id}/metrics`),

    /** Lanza recálculo de métricas de un proceso (admin) */
    recalculateMetrics: (id, runNow = false) =>
        api.post(`/api/process/${id}/metrics/recalculate`, { runNow }),
};

export default processService;
