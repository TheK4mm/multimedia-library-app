import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { Icon, Avatar } from "../../ui";
import { useAuth } from "../../../context/AuthContext";

const NAV = [
  { to: "/app/dashboard", icon: "home",  label: "Inicio"     },
  { to: "/app/catalog",   icon: "grid",  label: "Catálogo"   },
  { to: "/app/stats",     icon: "chart", label: "Estadísticas" },
  { to: "/app/profile",   icon: "user",  label: "Perfil"     },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandMark}>
          <Icon name="book" size={18} />
        </span>
        Biblioteca
      </div>

      <nav className={styles.nav}>
        <div className={styles.section}>Navegación</div>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ""}`
            }
          >
            <Icon name={item.icon} size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userRow}>
          <Avatar name={user?.displayName || user?.username} />
          <div>
            <div className={styles.userName}>
              {user?.displayName || user?.username}
            </div>
            <div className={styles.userMeta}>
              {user?.email || "Cuenta personal"}
            </div>
          </div>
        </div>
        <button className={styles.logout} onClick={logout}>
          <Icon name="logout" size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
