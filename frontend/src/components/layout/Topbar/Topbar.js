import React from "react";
import { useLocation, useNavigate, useMatch } from "react-router-dom";
import styles from "./Topbar.module.css";
import { Icon } from "../../ui";

const TITLES = {
  "/app/dashboard": "Inicio",
  "/app/catalog":   "Catálogo",
  "/app/stats":     "Estadísticas",
  "/app/profile":   "Perfil",
  "/app/items/new": "Nuevo item",
};

function titleFor(pathname) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/app/items/")) return "Detalle de item";
  return "Biblioteca";
}

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const inCatalog = useMatch("/app/catalog");
  const inProfile = useMatch("/app/profile");

  const handleQuickSearch = (event) => {
    const value = event.target.value;
    const params = new URLSearchParams(location.search);
    if (value) params.set("search", value);
    else params.delete("search");
    if (!inCatalog) {
      navigate(`/app/catalog?${params.toString()}`);
    } else {
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  };

  const currentSearch = new URLSearchParams(location.search).get("search") || "";

  return (
    <header className={styles.topbar}>
      <div className={styles.title}>{titleFor(location.pathname)}</div>

      {!inProfile && (
        <div className={styles.actions}>
          <div className={styles.search}>
            <span className={styles.searchIcon}>
              <Icon name="search" size={16} />
            </span>
            <input
              type="search"
              placeholder="Buscar en tu biblioteca…"
              className={styles.searchInput}
              value={currentSearch}
              onChange={handleQuickSearch}
              aria-label="Buscar"
            />
          </div>
        </div>
      )}
    </header>
  );
}
