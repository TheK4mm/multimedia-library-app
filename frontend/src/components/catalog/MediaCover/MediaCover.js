import React from "react";
import styles from "./MediaCover.module.css";
import { Icon } from "../../ui";
import { mediaByCode } from "../../../constants/media";

export default function MediaCover({ url, mediaType, title, year, size = 56 }) {
  const meta = mediaByCode(mediaType);
  const className = [styles.cover, styles[meta.code]].filter(Boolean).join(" ");
  return (
    <div className={className} aria-label={title}>
      {url ? (
        <img src={url} alt={title || meta.singular} className={styles.img} loading="lazy" />
      ) : (
        <Icon name={meta.icon} size={size} className={styles.fallbackIcon} />
      )}
      {year ? <span className={styles.year}>{year}</span> : null}
    </div>
  );
}
