// src/services/api.js
// Servicio centralizado para todas las llamadas HTTP.
// Usa cookies (credentials: "include") — NO tokens Bearer.

const BASE = process.env.REACT_APP_API_URL;

async function request(endpoint, options = {}) {
    const { headers, body, ...rest } = options;

    const config = {
        ...rest,
        credentials: "include",
        headers: {
            ...(body !== undefined && !(body instanceof FormData)
                ? { "Content-Type": "application/json" }
                : {}),
            ...headers,
        },
    };

    if (body !== undefined) {
        config.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    const res = await fetch(`${BASE}${endpoint}`, config);

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Error ${res.status}`);
    }

    // Algunas respuestas pueden no tener body (204 No Content)
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

const api = {
    get: (endpoint) => request(endpoint),
    post: (endpoint, body) => request(endpoint, { method: "POST", body }),
    put: (endpoint, body) => request(endpoint, { method: "PUT", body }),
    patch: (endpoint, body) => request(endpoint, { method: "PATCH", body }),
    del: (endpoint) => request(endpoint, { method: "DELETE" }),

    // Para envíos con FormData (archivos), no se pone Content-Type
    upload: (endpoint, formData, method = "POST") =>
        request(endpoint, { method, body: formData }),
};

export default api;
