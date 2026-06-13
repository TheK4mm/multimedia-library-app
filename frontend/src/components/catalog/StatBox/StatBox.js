import React from "react";
import styles from "./StatBox.module.css";
import { Icon } from "../../ui";

const TONES = {
  default: "",
  book:    styles.book,
  movie:   styles.movie,
  music:   styles.music,
  accent:  styles.accent,
  success: styles.success,
};

export default function StatBox({ icon = "book", label, value, hint, tone = "default" }) {
  return (
    <div className={`${styles.box} ${TONES[tone] || ""}`}>
      <div className={styles.iconWrap}>
        <Icon name={icon} size={20} />
      </div>
      <div>
        <div className={styles.label}>{label}</div>
        <div className={styles.value}>{value}</div>
        {hint && <div className={styles.hint}>{hint}</div>}
      </div>
    </div>
  );
}
