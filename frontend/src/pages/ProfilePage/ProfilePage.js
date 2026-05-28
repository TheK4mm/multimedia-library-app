import React from "react";
import styles from "./ProfilePage.module.css";
import { Avatar, Button, Icon } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Avatar size="xl" name={user?.displayName || user?.username} src={user?.avatarUrl} />
        <div className={styles.text}>
          <h1>{user?.displayName || user?.username}</h1>
          <p>Cuenta de la Biblioteca Multimedia</p>
        </div>
      </header>

      <section className={styles.card}>
        <div className={styles.row}>
          <span className={styles.label}>Usuario</span>
          <span className={styles.value}>{user?.username}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Nombre</span>
          <span className={styles.value}>{user?.displayName || "—"}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Email</span>
          <span className={styles.value}>{user?.email || "—"}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Biografía</span>
          <span className={styles.value}>{user?.bio || "—"}</span>
        </div>
      </section>

      <div className={styles.actions}>
        <Button variant="outline" leftIcon={<Icon name="logout" size={16} />} onClick={logout}>
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
