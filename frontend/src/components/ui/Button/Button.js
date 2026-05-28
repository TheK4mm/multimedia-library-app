import React from "react";
import styles from "./Button.module.css";

const VARIANTS = {
  primary:      styles.primary,
  secondary:    styles.secondary,
  ghost:        styles.ghost,
  danger:       styles.danger,
  "danger-solid": styles.dangerSolid,
  outline:      styles.outline,
};

const SIZES = { sm: styles.sm, md: "", lg: styles.lg };

export default function Button({
  variant = "primary",
  size = "md",
  iconOnly = false,
  fullWidth = false,
  className = "",
  type = "button",
  leftIcon,
  rightIcon,
  loading = false,
  disabled,
  children,
  ...rest
}) {
  const classes = [
    styles.button,
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || "",
    iconOnly ? styles.iconOnly : "",
    fullWidth ? styles.fullWidth : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
