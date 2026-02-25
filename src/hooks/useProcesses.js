import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import processService from "../services/processService";

export default function useProcesses(options = {}) {
    const {
        autoFetch = true,
        initialData = [],
        showErrorToast = true,
        errorMessage = "No se pudieron cargar los registros",
        onError,
        params = {},
    } = options;

    const [items, setItems] = useState(initialData);
    const [loading, setLoading] = useState(autoFetch);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 100,
        total: 0,
        totalPages: 1,
    });

    const refresh = useCallback(
        async (extraParams = {}) => {
            setLoading(true);
            setError(null);

            try {
                // Por defecto cargamos todo el dataset para evitar cortes por limite de pagina.
                const list = await processService.listAll({ ...params, ...extraParams });
                setItems(list);
                setPagination({
                    page: 1,
                    limit: list.length || 100,
                    total: list.length,
                    totalPages: 1,
                });

                return list;
            } catch (err) {
                console.error(err);
                setError(err);
                setItems([]);
                onError?.(err);
                if (showErrorToast) {
                    toast.error(errorMessage);
                }
                return [];
            } finally {
                setLoading(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [errorMessage, onError, showErrorToast, JSON.stringify(params)]
    );

    useEffect(() => {
        if (!autoFetch) return;
        refresh();
    }, [autoFetch, refresh]);

    return {
        items,
        setItems,
        loading,
        error,
        pagination,
        refresh,
    };
}
