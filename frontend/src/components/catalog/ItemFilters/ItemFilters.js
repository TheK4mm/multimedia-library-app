import React from "react";
import styles from "./ItemFilters.module.css";
import { Icon } from "../../ui";
import { MEDIA_TYPES, STATUSES, SORT_OPTIONS } from "../../../constants/media";

export default function ItemFilters({
  mediaType, status, favorite, sort,
  onChange,
}) {
  const set = (patch) => onChange?.({ mediaType, status, favorite, sort, ...patch });

  return (
    <div className={styles.bar} role="toolbar" aria-label="Filtros del catálogo">
      <div className={styles.group}>
        <button
          type="button"
          className={`${styles.pill} ${!mediaType ? styles.pillActive : ""}`}
          onClick={() => set({ mediaType: "" })}
        >
          Todos
        </button>
        {MEDIA_TYPES.map((m) => (
          <button
            key={m.code}
            type="button"
            className={`${styles.pill} ${mediaType === m.code ? styles.pillActive : ""}`}
            onClick={() => set({ mediaType: m.code })}
          >
            <Icon name={m.icon} size={14} />
            {m.label}
          </button>
        ))}
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.group}>
        <button
          type="button"
          className={`${styles.pill} ${!status ? styles.pillActive : ""}`}
          onClick={() => set({ status: "" })}
        >
          Cualquier estado
        </button>
        {STATUSES.map((s) => (
          <button
            key={s.code}
            type="button"
            className={`${styles.pill} ${status === s.code ? styles.pillActive : ""}`}
            onClick={() => set({ status: s.code })}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <button
        type="button"
        className={`${styles.pill} ${favorite ? styles.pillActive : ""}`}
        onClick={() => set({ favorite: favorite ? "" : "true" })}
      >
        <Icon name="heart" size={14} />
        Favoritos
      </button>

      <div className={styles.spacer} />

      <div className={styles.group}>
        <Icon name="sort" size={16} />
        <label htmlFor="sort-select" className={styles.sortLabel}>Ordenar</label>
        <select
          id="sort-select"
          className={styles.sortSelect}
          value={sort || "recent"}
          onChange={(e) => set({ sort: e.target.value })}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
