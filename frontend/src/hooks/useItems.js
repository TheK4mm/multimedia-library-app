import { useCallback, useEffect, useState } from "react";
import { itemsApi } from "../services/itemsApi";

export function useItems(params = {}) {
  const [items, setItems]       = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const serializedParams = JSON.stringify(params);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await itemsApi.list(JSON.parse(serializedParams));
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [serializedParams]);

  useEffect(() => { load(); }, [load]);

  return { items, total, loading, error, reload: load, setItems };
}

export function useStats() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await itemsApi.stats();
      setStats(data.stats);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { stats, loading, error, reload: load };
}
