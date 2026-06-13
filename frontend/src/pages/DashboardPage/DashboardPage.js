import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./DashboardPage.module.css";
import { Button, EmptyState, Icon, Spinner, useToast } from "../../components/ui";
import StatBox  from "../../components/catalog/StatBox/StatBox";
import ItemCard from "../../components/catalog/ItemCard/ItemCard";
import { useAuth } from "../../context/AuthContext";
import { useItems, useStats } from "../../hooks/useItems";
import { itemsApi } from "../../services/itemsApi";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast    = useToast();
  const { stats,  loading: loadingStats }  = useStats();
  const { items: recent,    loading: loadingRecent }    = useItems({ sort: "recent", pageSize: 8 });
  const { items: favorites, loading: loadingFavorites, setItems: setFavorites } =
    useItems({ favorite: "true", pageSize: 6 });

  // Al desmarcar un favorito desaparece al instante de "Tus favoritos";
  // si la petición falla, se restaura la lista previa.
  const handleToggleFavorite = async (item) => {
    const next = !item.favorite;
    const snapshot = favorites;
    setFavorites((list) =>
      next
        ? list.map((i) => (i.id === item.id ? { ...i, favorite: next } : i))
        : list.filter((i) => i.id !== item.id)
    );
    try {
      await itemsApi.update(item.id, { favorite: next });
    } catch (err) {
      setFavorites(snapshot);
      toast.error(err.message || "No se pudo actualizar el favorito.");
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            Hola, {user?.displayName || user?.username} 👋
          </h1>
          <p className={styles.heroSubtitle}>
            Este es el resumen de tu biblioteca personal. Sigue añadiendo
            títulos, valorando los que ya conoces y descubriendo lo que
            tienes pendiente.
          </p>
        </div>
      </header>

      {loadingStats ? (
        <Spinner center size="lg" />
      ) : (
        <section className={styles.statsGrid}>
          <StatBox icon="book"  label="En tu biblioteca"
                   value={stats?.total ?? 0}
                   hint="Items totales"
                   tone="default" />
          <StatBox icon="book"  label="Libros"      value={stats?.byType?.book  ?? 0} tone="book"  />
          <StatBox icon="film"  label="Películas"   value={stats?.byType?.movie ?? 0} tone="movie" />
          <StatBox icon="music" label="Música"      value={stats?.byType?.music ?? 0} tone="music" />
          <StatBox icon="heart" label="Favoritos"   value={stats?.favorites ?? 0}     tone="accent" />
          <StatBox icon="check" label="Completados" value={stats?.completed ?? 0}     tone="success" />
          <StatBox icon="star"  label="Valoración media"
                   value={stats?.avgRating ? stats.avgRating.toFixed(1) : "—"}
                   hint="Sobre 5" />
        </section>
      )}

      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Añadidos recientemente</h2>
          <Link to="/app/catalog">
            <Button variant="ghost" size="sm" rightIcon={<Icon name="arrow_right" size={14} />}>
              Ver todo
            </Button>
          </Link>
        </header>
        {loadingRecent ? (
          <Spinner center />
        ) : recent.length === 0 ? (
          <EmptyState
            icon={<Icon name="book" size={28} />}
            title="Tu biblioteca está vacía"
            description="Empieza añadiendo el primer libro, película o disco a tu catálogo."
            action={
              <Button onClick={() => navigate("/app/items/new")}
                      leftIcon={<Icon name="plus" size={14} />}>
                Crear primer item
              </Button>
            }
          />
        ) : (
          <div className={styles.cardsGrid}>
            {recent.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Tus favoritos</h2>
          <Link to="/app/catalog?favorite=true">
            <Button variant="ghost" size="sm" rightIcon={<Icon name="arrow_right" size={14} />}>
              Ver todos
            </Button>
          </Link>
        </header>
        {loadingFavorites ? (
          <Spinner center />
        ) : favorites.length === 0 ? (
          <EmptyState
            icon={<Icon name="heart" size={26} />}
            title="Sin favoritos por ahora"
            description="Marca con el corazón los items que más te gustan para verlos aquí."
          />
        ) : (
          <div className={styles.cardsGrid}>
            {favorites.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
