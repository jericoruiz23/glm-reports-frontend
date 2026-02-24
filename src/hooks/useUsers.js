import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import usersService from "../services/usersService";

export default function useUsers(options = {}) {
  const {
    autoFetch = true,
    initialData = [],
    showErrorToast = true,
    errorMessage = "No se pudieron cargar los usuarios",
    onError,
  } = options;

  const [items, setItems] = useState(initialData);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await usersService.list();
      const normalized = Array.isArray(data) ? data : [];
      setItems(normalized);
      return normalized;
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
  }, [errorMessage, onError, showErrorToast]);

  useEffect(() => {
    if (!autoFetch) return;
    refresh();
  }, [autoFetch, refresh]);

  return {
    items,
    setItems,
    loading,
    error,
    refresh,
  };
}
