import React, { forwardRef, useId } from "react";
import styles from "./Textarea.module.css";

const Textarea = forwardRef(function Textarea(
  { id, label, error, helpText, required, className = "", ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id || `textarea-${autoId}`;

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={`${styles.textarea} ${className}`}
        aria-invalid={error ? true : undefined}
        required={required}
        {...rest}
      />
      {error && <span className={styles.error}>{error}</span>}
      {!error && helpText && <span className={styles.help}>{helpText}</span>}
    </div>
  );
});

export default Textarea;
