import React, { useState } from "react";
import styles from "./ItemForm.module.css";
import { Input, Select, Textarea, Button, Rating, Icon } from "../../ui";
import { MEDIA_TYPES, STATUSES } from "../../../constants/media";

const emptyDraft = {
  title:       "",
  mediaType:   "book",
  year:        "",
  creatorName: "",
  coverUrl:    "",
  synopsis:    "",
  rating:      0,
  status:      "pending",
  favorite:    false,
  notes:       "",
};

const toDraft = (item) => ({
  ...emptyDraft,
  ...item,
  year:    item?.year   ?? "",
  rating:  item?.rating ?? 0,
});

export default function ItemForm({ initialItem, submitLabel = "Guardar", onSubmit, onCancel, isSubmitting }) {
  const [draft, setDraft]   = useState(toDraft(initialItem));
  const [errors, setErrors] = useState({});

  const update = (patch) => setDraft((prev) => ({ ...prev, ...patch }));

  const validate = () => {
    const e = {};
    if (!draft.title.trim()) e.title = "Ingresa un título.";
    if (!draft.mediaType)    e.mediaType = "Selecciona un tipo.";
    if (draft.year !== "" && draft.year !== null && (Number.isNaN(Number(draft.year)) || Number(draft.year) < 0)) {
      e.year = "Año inválido.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    const payload = {
      ...draft,
      title:       draft.title.trim(),
      creatorName: draft.creatorName?.trim() || null,
      year:        draft.year === "" ? null : Number(draft.year),
      synopsis:    draft.synopsis?.trim() || null,
      notes:       draft.notes?.trim() || null,
      coverUrl:    draft.coverUrl?.trim() || null,
      rating:      draft.rating || null,
    };
    onSubmit?.(payload);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={`${styles.section} ${styles.full}`}>
        <Input
          label="Título"
          required
          placeholder="Ej. Cien años de soledad"
          value={draft.title}
          onChange={(e) => update({ title: e.target.value })}
          error={errors.title}
        />
      </div>

      <Select
        label="Tipo"
        required
        value={draft.mediaType}
        onChange={(e) => update({ mediaType: e.target.value })}
        options={MEDIA_TYPES.map((m) => ({ value: m.code, label: m.label }))}
      />

      <Select
        label="Estado"
        value={draft.status}
        onChange={(e) => update({ status: e.target.value })}
        options={STATUSES.map((s) => ({ value: s.code, label: s.label }))}
      />

      <Input
        label="Autor / Director / Artista"
        placeholder="Ej. Gabriel García Márquez"
        value={draft.creatorName || ""}
        onChange={(e) => update({ creatorName: e.target.value })}
      />

      <Input
        label="Año"
        type="number"
        inputMode="numeric"
        placeholder="Ej. 1967"
        min={0}
        max={2999}
        value={draft.year ?? ""}
        onChange={(e) => update({ year: e.target.value })}
        error={errors.year}
      />

      <Input
        label="URL de portada"
        type="url"
        placeholder="https://…"
        value={draft.coverUrl || ""}
        onChange={(e) => update({ coverUrl: e.target.value })}
        helpText="Opcional. Si la dejas vacía, mostramos una portada generada."
        wrapperClassName={styles.full}
      />

      <div className={styles.ratingField}>
        <span className={styles.ratingLabel}>Tu valoración</span>
        <Rating
          value={Math.round(draft.rating || 0)}
          onChange={(v) => update({ rating: v })}
          size={22}
          showValue
        />
      </div>

      <label className={styles.toggleRow}>
        <input
          type="checkbox"
          className={styles.toggle}
          checked={Boolean(draft.favorite)}
          onChange={(e) => update({ favorite: e.target.checked })}
        />
        <span className={styles.toggleLabel}>
          <Icon name="heart" size={16} />
          Marcar como favorito
        </span>
      </label>

      <div className={styles.full}>
        <Textarea
          label="Sinopsis"
          placeholder="Resumen breve, contexto o información destacada…"
          value={draft.synopsis || ""}
          onChange={(e) => update({ synopsis: e.target.value })}
        />
      </div>

      <div className={styles.full}>
        <Textarea
          label="Notas personales"
          placeholder="Tus impresiones, recordatorios, citas favoritas…"
          value={draft.notes || ""}
          onChange={(e) => update({ notes: e.target.value })}
        />
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
