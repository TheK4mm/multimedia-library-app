import React from "react";
import styles from "./AuthLayout.module.css";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.hero}>
        <div className={styles.heroBody}>
          <span className={styles.accent} />
          <h1>Tu catálogo personal de libros, películas y música.</h1>
          <p>Todo lo que lees, ves y escuchas, organizado en un solo lugar.</p>
        </div>
      </aside>

      <main className={styles.form}>
        <div className={styles.card}>
          <header>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </header>
          {children}
          {footer && <div className={styles.switch}>{footer}</div>}
        </div>
      </main>
    </div>
  );
}
