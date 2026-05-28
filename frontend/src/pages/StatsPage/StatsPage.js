import React from "react";
import styles from "./StatsPage.module.css";
import StatBox from "../../components/catalog/StatBox/StatBox";
import { Spinner, EmptyState, Icon } from "../../components/ui";
import { useStats } from "../../hooks/useItems";
import { MEDIA_TYPES, STATUSES } from "../../constants/media";

const TYPE_BAR_CLASS = {
  book:  "barFillBook",
  movie: "barFillMovie",
  music: "barFillMusic",
};

export default function StatsPage() {
  const { stats, loading } = useStats();

  if (loading) return <Spinner center size="lg" />;
  if (!stats || stats.total === 0) {
    return (
      <EmptyState
        icon={<Icon name="chart" size={28} />}
        title="Aún no hay datos"
        description="Empieza añadiendo items para ver estadísticas de tu biblioteca."
      />
    );
  }

  const totalByType   = stats.total || 1;
  const totalByStatus = Object.values(stats.byStatus || {}).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Estadísticas</h1>
        <p>Una mirada general a tu colección y a tu actividad.</p>
      </header>

      <section className={styles.grid}>
        <StatBox icon="book"  label="Total"          value={stats.total}     hint="Items en tu biblioteca" />
        <StatBox icon="check" label="Completados"    value={stats.completed} tone="success" />
        <StatBox icon="heart" label="Favoritos"      value={stats.favorites} tone="accent" />
        <StatBox icon="star"  label="Valoración media"
                 value={stats.avgRating ? stats.avgRating.toFixed(1) : "—"}
                 hint="Sobre 5" />
      </section>

      <section className={styles.distribution}>
        <h2 className={styles.distributionTitle}>Distribución por tipo de medio</h2>
        {MEDIA_TYPES.map((m) => {
          const count = stats.byType?.[m.code] || 0;
          const pct = Math.round((count / totalByType) * 100);
          return (
            <div key={m.code} className={styles.bar}>
              <span className={styles.barLabel}>{m.label}</span>
              <div className={styles.barTrack}>
                <div
                  className={`${styles.barFill} ${styles[TYPE_BAR_CLASS[m.code]] || ""}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={styles.barValue}>{count}</span>
            </div>
          );
        })}
      </section>

      <section className={styles.distribution}>
        <h2 className={styles.distributionTitle}>Distribución por estado</h2>
        {STATUSES.map((s) => {
          const count = stats.byStatus?.[s.code] || 0;
          const pct = Math.round((count / totalByStatus) * 100);
          return (
            <div key={s.code} className={styles.bar}>
              <span className={styles.barLabel}>{s.label}</span>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: `${pct}%` }} />
              </div>
              <span className={styles.barValue}>{count}</span>
            </div>
          );
        })}
      </section>
    </div>
  );
}
