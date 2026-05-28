import React from "react";
import styles from "./Card.module.css";

export default function Card({
  as: Tag = "div",
  padded = true,
  interactive = false,
  flat = false,
  className = "",
  children,
  ...rest
}) {
  const classes = [
    styles.card,
    padded ? styles.padded : "",
    interactive ? styles.interactive : "",
    flat ? styles.flat : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
