import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./ItemDetailPage.module.css";
import MediaCover from "../../components/catalog/MediaCover/MediaCover";
import { Badge, Button, Icon, Rating, Spinner, useToast } from "../../components/ui";
import { itemsApi } from "../../services/itemsApi";
import { mediaByCode, statusByCode } from "../../constants/media";

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast    = useToast();
  const [item, setItem]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    itemsApi.get(id).then((data) => {
      if (alive) {
        setItem(data.item);
        setLoading(false);
      }
    }).catch((err) => {
      toast.error(err.message);
      navigate("/app/catalog", { replace: true });
    });
    return () => { alive = false; };
  }, [id, navigate, toast]);

  const onDelete = async () => {
    if (!window.confirm(`¿Eliminar "${item.title}" definitivamente?`)) return;
    try {
      await itemsApi.remove(item.id);
      toast.success("Item eliminado.");
      navigate("/app/catalog");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleFavorite = async () => {
    const next = !item.favorite;
    setItem({ ...item, favorite: next });
    try {
      await itemsApi.update(item.id, { favorite: next });
      toast.success(next ? "Añadido a favoritos." : "Quitado de favoritos.");
    } catch (err) {
      setItem({ ...item, favorite: !next });
      toast.error(err.message);
    }
  };

  const updateStatus = async (status) => {
    const previous = item.status;
    setItem({ ...item, status });
    try {
      await itemsApi.update(item.id, { status });
    } catch (err) {
      setItem({ ...item, status: previous });
      toast.error(err.message);
    }
  };

  if (loading) return <Spinner center size="lg" />;
  if (!item) return null;

  const media  = mediaByCode(item.mediaType);
  const status = statusByCode(item.status);

  return (
    <>
      <Link to="/app/catalog" className={styles.backLink}>
        <Icon name="arrow_left" size={14} /> Volver al catálogo
      </Link>

      <div className={styles.page}>
        <div className={styles.coverColumn}>
          <div className={styles.coverShell}>
            <MediaCover url={item.coverUrl} mediaType={item.mediaType}
                        title={item.title} year={item.year} size={72} />
          </div>
          <div className={styles.actionGroup}>
            <Button
              variant={item.favorite ? "danger-solid" : "outline"}
              fullWidth
              leftIcon={<Icon name="heart" size={16} />}
              onClick={toggleFavorite}
            >
              {item.favorite ? "Quitar favorito" : "Marcar favorito"}
            </Button>
            <Button
              fullWidth
              variant="secondary"
              leftIcon={<Icon name="edit" size={16} />}
              onClick={() => navigate(`/app/items/${item.id}/edit`)}
            >
              Editar item
            </Button>
            <Button
              fullWidth
              variant="danger"
              leftIcon={<Icon name="trash" size={16} />}
              onClick={onDelete}
            >
              Eliminar
            </Button>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.titleRow}>
            <Badge variant={media.badge}>
              <Icon name={media.icon} size={12} /> {media.singular}
            </Badge>
            <Badge variant={status.variant} dot>{status.label}</Badge>
            {item.favorite && (
              <Badge variant="danger"><Icon name="heart" size={12} /> Favorito</Badge>
            )}
          </div>

          <h1 className={styles.title}>{item.title}</h1>
          {item.creatorName && <p className={styles.creator}>Por {item.creatorName}</p>}

          <div>
            <Rating value={Math.round(item.rating || 0)} size={22} showValue />
          </div>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Año</div>
              <div className={styles.metaValue}>{item.year || "—"}</div>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Tipo</div>
              <div className={styles.metaValue}>{media.singular}</div>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Añadido</div>
              <div className={styles.metaValue}>
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
              </div>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Actualizado</div>
              <div className={styles.metaValue}>
                {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "—"}
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Cambiar estado</h3>
            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
              {[
                { code: "pending",     label: "Pendiente" },
                { code: "in_progress", label: "En curso"  },
                { code: "completed",   label: "Completado" },
                { code: "abandoned",   label: "Abandonado" },
              ].map((s) => (
                <Button
                  key={s.code}
                  size="sm"
                  variant={item.status === s.code ? "primary" : "outline"}
                  onClick={() => updateStatus(s.code)}
                >
                  {s.label}
                </Button>
              ))}
            </div>
          </div>

          {item.synopsis && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Sinopsis</h3>
              <div className={styles.prose}>{item.synopsis}</div>
            </div>
          )}

          {item.notes && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Tus notas</h3>
              <div className={styles.prose}>{item.notes}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
