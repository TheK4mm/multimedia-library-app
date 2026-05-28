import React from "react";
import styles from "./Spinner.module.css";

const SIZES = { sm: styles.sm, md: styles.md, lg: styles.lg };

export default function Spinner({ size = "md", center = false, label = "Cargando" }) {
  const node = (
    <span
      className={`${styles.spinner} ${SIZES[size] || SIZES.md}`}
      role="status"
      aria-label={label}
    />
  );
  return center ? <div className={styles.center}>{node}</div> : node;
}
