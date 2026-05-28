import React, { createContext, useCallback, useContext, useState, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./Toast.module.css";
import Icon from "../Icon/Icon";

const ToastContext = createContext(null);

const ICONS = {
  success: <Icon name="check" size={18} />,
  error:   <Icon name="alert" size={18} />,
  warning: <Icon name="alert" size={18} />,
  info:    <Icon name="info"  size={18} />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (toast) => {
      const id = ++idRef.current;
      const t = {
        id,
        variant: "info",
        duration: 4000,
        ...toast,
      };
      setToasts((current) => [...current, t]);
      if (t.duration > 0) setTimeout(() => remove(id), t.duration);
      return id;
    },
    [remove]
  );

  const api = {
    show:    (msg, opts) => push({ body: msg, ...opts }),
    success: (msg, opts) => push({ body: msg, variant: "success", ...opts }),
    error:   (msg, opts) => push({ body: msg, variant: "error",   ...opts }),
    warning: (msg, opts) => push({ body: msg, variant: "warning", ...opts }),
    info:    (msg, opts) => push({ body: msg, variant: "info",    ...opts }),
    dismiss: remove,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div className={styles.viewport} aria-live="polite" aria-atomic="true">
          {toasts.map((t) => (
            <div key={t.id} className={`${styles.toast} ${styles[t.variant] || ""}`} role="status">
              <span className={styles.icon}>{ICONS[t.variant]}</span>
              <div className={styles.content}>
                {t.title && <div className={styles.title}>{t.title}</div>}
                <div className={styles.body}>{t.body}</div>
              </div>
              <button
                className={styles.close}
                onClick={() => remove(t.id)}
                aria-label="Cerrar notificación"
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
};
