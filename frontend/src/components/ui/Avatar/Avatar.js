import React from "react";
import styles from "./Avatar.module.css";

const initials = (name) =>
  (name || "?")
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const SIZES = { sm: styles.sm, md: "", lg: styles.lg, xl: styles.xl };

export default function Avatar({ name, src, size = "md", className = "", ...rest }) {
  return (
    <span className={`${styles.avatar} ${SIZES[size] || ""} ${className}`} {...rest}>
      {src
        ? <img src={src} alt={name || "avatar"} className={styles.image} />
        : initials(name)}
    </span>
  );
}
