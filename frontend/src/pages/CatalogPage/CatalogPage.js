import React, { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./CatalogPage.module.css";
import ItemCard      from "../../components/catalog/ItemCard/ItemCard";
import ItemFilters   from "../../components/catalog/ItemFilters/ItemFilters";
import { Button, EmptyState, Icon, Spinner, useToast } from "../../components/ui";
import { useItems } from "../../hooks/useItems";
import { itemsApi } from "../../services/itemsApi";

export default function CatalogPage() {
  const navigate = useNavigate();
  const toast    = useToast();
  const [params, setParams] = useSearchParams();

  const filters = useMemo(() => ({
    search:    params.get("search")    || "",
    mediaType: params.get("mediaType") || "",
    status:    params.get("status")    || "",
    favorite:  params.get("favorite")  || "",
    sort:      params.get("sort")      || "recent",
  }), [params]);

  const { items, total, loading, reload, setItems } = useItems({
    ...filters,
    pageSize: 100,
  });

  const updateFilters = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === "" || v == null) next.delete(k);
      else next.set(k, v);
    });
    setParams(next, { replace: true });
  };

  const handleEdit = (item) => navigate(`/app/items/${item.id}/edit`);

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Eliminar "${item.title}"?`)) return;
    try {
      await itemsApi.remove(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success("Item eliminado.");
    } catch (err) {
      toast.error(err.message || "No se pudo eliminar el item.");
    }
  };

  const handleToggleFavorite = async (item) => {
    const optimistic = !item.favorite;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, favorite: optimistic } : i))
    );
    try {
      await itemsApi.update(item.id, { favorite: optimistic });
    } catch (err) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, favorite: !optimistic } : i))
      );
      toast.error(err.message || "No se pudo actualizar el favorito.");
    }
  };

  const showingLabel = loading
    ? "Cargando…"
    : `${total} resultado${total === 1 ? "" : "s"}`;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Catálogo</h1>
          <p className={styles.summary}>{showingLabel}</p>
        </div>
        <Button
          leftIcon={<Icon name="plus" size={16} />}
          onClick={() => navigate("/app/items/new")}
        >
          Nuevo item
        </Button>
      </header>

      <ItemFilters {...filters} onChange={updateFilters} />

      {loading ? (
        <Spinner center size="lg" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Icon name="search" size={28} />}
          title="Sin resultados"
          description="Prueba a cambiar los filtros o buscar con otro término."
          action={
            <Button variant="outline" onClick={() => setParams({})}>
              Limpiar filtros
            </Button>
          }
        />
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
