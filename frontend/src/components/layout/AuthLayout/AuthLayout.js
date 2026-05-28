import React from "react";
import styles from "./AuthLayout.module.css";
import { Icon } from "../../ui";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.hero}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>
            <Icon name="book" size={22} />
          </span>
          Biblioteca Multimedia
        </div>

        <div className={styles.heroBody}>
          <h1>Tu catálogo personal de libros, películas y música.</h1>
          <p>
            Organiza tus lecturas, las películas que quieres ver y los discos
            que descubres — todo en un único lugar, con búsqueda, filtros y
            estadísticas para entender mejor tu propio gusto.
          </p>
        </div>

        <div className={styles.heroFooter}>
          <div>
            <strong>3</strong>
            tipos de medios
          </div>
          <div>
            <strong>∞</strong>
            entradas posibles
          </div>
          <div>
            <strong>1</strong>
            biblioteca a tu medida
          </div>
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
