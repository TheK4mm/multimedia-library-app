import React from "react";
import styles from "./Badge.module.css";

const VARIANTS = {
  neutral: styles.neutral,
  brand:   styles.brand,
  success: styles.success,
  warning: styles.warning,
  danger:  styles.danger,
  info:    styles.info,
  book:    styles.book,
  movie:   styles.movie,
  music:   styles.music,
};

export default function Badge({ variant = "neutral", dot = false, children, className = "", ...rest }) {
  const classes = [styles.badge, VARIANTS[variant] || VARIANTS.neutral, className]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={classes} {...rest}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}
