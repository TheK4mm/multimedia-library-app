import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./ItemFormPage.module.css";
import ItemForm from "../../components/catalog/ItemForm/ItemForm";
import { Icon, Spinner, useToast } from "../../components/ui";
import { itemsApi } from "../../services/itemsApi";

export default function ItemFormPage({ mode = "create" }) {
  const navigate = useNavigate();
  const toast    = useToast();
  const { id }   = useParams();

  const [initial, setInitial]     = useState(null);
  const [loading, setLoading]     = useState(mode === "edit");
  const [submitting, setSubmit]   = useState(false);

  useEffect(() => {
    if (mode !== "edit") return;
    let alive = true;
    itemsApi.get(id)
      .then((data) => { if (alive) { setInitial(data.item); setLoading(false); } })
      .catch((err) => {
        toast.error(err.message);
        navigate("/app/catalog", { replace: true });
      });
    return () => { alive = false; };
  }, [id, mode, navigate, toast]);

  const handleSubmit = async (payload) => {
    setSubmit(true);
    try {
      if (mode === "edit") {
        const { item } = await itemsApi.update(id, payload);
        toast.success("Item actualizado.");
        navigate(`/app/items/${item.id}`);
      } else {
        const { item } = await itemsApi.create(payload);
        toast.success("Item creado.");
        navigate(`/app/items/${item.id}`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmit(false);
    }
  };

  if (loading) return <Spinner center size="lg" />;

  return (
    <div className={styles.page}>
      <Link to={mode === "edit" ? `/app/items/${id}` : "/app/catalog"}
            className={styles.backLink}>
        <Icon name="arrow_left" size={14} /> Volver
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>
          {mode === "edit" ? "Editar item" : "Añadir nuevo item"}
        </h1>
        <p className={styles.subtitle}>
          {mode === "edit"
            ? "Actualiza la información de este item de tu biblioteca."
            : "Registra un libro, película o disco para tu catálogo personal."}
        </p>
      </header>

      <div className={styles.card}>
        <ItemForm
          initialItem={initial}
          submitLabel={mode === "edit" ? "Guardar cambios" : "Crear item"}
          isSubmitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
        />
      </div>
    </div>
  );
}
