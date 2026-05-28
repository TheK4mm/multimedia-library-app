import React, { useState } from "react";
import styles from "./Rating.module.css";
import Icon from "../Icon/Icon";

export default function Rating({
  value = 0,
  onChange,
  max = 5,
  size = 18,
  showValue = false,
  ariaLabel = "Valoración",
}) {
  const [hover, setHover] = useState(null);
  const interactive = typeof onChange === "function";
  const displayValue = hover !== null ? hover : value || 0;

  return (
    <span className={styles.wrapper} role={interactive ? "radiogroup" : "img"} aria-label={ariaLabel}>
      {Array.from({ length: max }, (_, i) => {
        const idx = i + 1;
        const filled = displayValue >= idx;
        const className = [styles.star, filled ? styles.filled : "", interactive ? styles.interactive : ""]
          .filter(Boolean)
          .join(" ");
        const StarComponent = interactive ? "button" : "span";
        return (
          <StarComponent
            key={idx}
            type={interactive ? "button" : undefined}
            className={className}
            onClick={interactive ? () => onChange(idx === value ? 0 : idx) : undefined}
            onMouseEnter={interactive ? () => setHover(idx) : undefined}
            onMouseLeave={interactive ? () => setHover(null) : undefined}
            aria-label={interactive ? `${idx} estrella${idx > 1 ? "s" : ""}` : undefined}
          >
            <Icon name="star" size={size} />
          </StarComponent>
        );
      })}
      {showValue && (
        <span className={styles.label}>
          {value ? Number(value).toFixed(1) : "—"}
        </span>
      )}
    </span>
  );
}
