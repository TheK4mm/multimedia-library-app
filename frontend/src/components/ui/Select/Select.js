import React, { forwardRef, useId } from "react";
import styles from "./Select.module.css";

const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const Select = forwardRef(function Select(
  { id, label, options = [], required, className = "", children, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id || `select-${autoId}`;
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.wrapper}>
        <select
          ref={ref}
          id={inputId}
          className={`${styles.select} ${className}`}
          required={required}
          {...rest}
        >
          {children ||
            options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
        </select>
        <span className={styles.chevron}><Chevron /></span>
      </div>
    </div>
  );
});

export default Select;
