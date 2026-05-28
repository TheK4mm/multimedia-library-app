import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ItemCard.module.css";
import MediaCover from "../MediaCover/MediaCover";
import { Badge, Rating, Icon } from "../../ui";
import { mediaByCode, statusByCode } from "../../../constants/media";

export default function ItemCard({ item, onToggleFavorite, onEdit, onDelete }) {
  const navigate = useNavigate();
  const media = mediaByCode(item.mediaType);
  const status = statusByCode(item.status);

  const goToDetail = () => navigate(`/app/items/${item.id}`);

  const stopAnd = (fn) => (event) => {
    event.stopPropagation();
    fn?.(item);
  };

  return (
    <article
      className={styles.card}
      onClick={goToDetail}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") goToDetail(); }}
    >
      {onToggleFavorite && (
        <button
          type="button"
          className={`${styles.favorite} ${item.favorite ? styles.favoriteActive : ""}`}
          onClick={stopAnd(onToggleFavorite)}
          aria-label={item.favorite ? "Quitar de favoritos" : "Marcar como favorito"}
        >
          <Icon name="heart" size={16} />
        </button>
      )}

      <div className={styles.coverSlot}>
        <MediaCover
          url={item.coverUrl}
          mediaType={item.mediaType}
          title={item.title}
          year={item.year}
        />
      </div>

      <div className={styles.body}>
        <div className={styles.badges}>
          <Badge variant={media.badge}>
            <Icon name={media.icon} size={12} />
            {media.singular}
          </Badge>
          <Badge variant={status.variant} dot>{status.label}</Badge>
        </div>

        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.creator}>
          {item.creatorName || "Sin autor"}
        </p>

        <div className={styles.footer}>
          <Rating value={Math.round(item.rating || 0)} showValue={Boolean(item.rating)} size={14} />
          {(onEdit || onDelete) && (
            <div className={styles.actions} role="group">
              {onEdit && (
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={stopAnd(onEdit)}
                  aria-label="Editar"
                  title="Editar"
                >
                  <Icon name="edit" size={14} />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  className={`${styles.iconBtn} ${styles.danger}`}
                  onClick={stopAnd(onDelete)}
                  aria-label="Eliminar"
                  title="Eliminar"
                >
                  <Icon name="trash" size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
