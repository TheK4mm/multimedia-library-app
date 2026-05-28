import React, { forwardRef, useId } from "react";
import styles from "./Input.module.css";

const Input = forwardRef(function Input(
  {
    id,
    label,
    leftIcon,
    rightIcon,
    error,
    helpText,
    required,
    className = "",
    wrapperClassName = "",
    ...rest
  },
  ref
) {
  const autoId = useId();
  const inputId = id || `input-${autoId}`;
  const isInvalid = Boolean(error);

  const fieldClasses = [styles.field, isInvalid ? styles.invalid : "", wrapperClassName]
    .filter(Boolean)
    .join(" ");

  const inputClasses = [
    styles.input,
    leftIcon ? styles.hasLeftIcon : "",
    rightIcon ? styles.hasRightIcon : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={fieldClasses}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.wrapper}>
        {leftIcon && <span className={styles.iconLeft}>{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={isInvalid || undefined}
          aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
          required={required}
          {...rest}
        />
        {rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
      </div>
      {error && (
        <span id={`${inputId}-error`} className={styles.error}>
          {error}
        </span>
      )}
      {!error && helpText && (
        <span id={`${inputId}-help`} className={styles.help}>
          {helpText}
        </span>
      )}
    </div>
  );
});

export default Input;
