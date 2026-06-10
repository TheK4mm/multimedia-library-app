import React, { forwardRef, useId, useState } from "react";
import styles from "./Input.module.css";
import Icon from "../Icon/Icon";

const Input = forwardRef(function Input(
  {
    id,
    label,
    type = "text",
    leftIcon,
    rightIcon,
    error,
    helpText,
    required,
    passwordToggle = false,
    className = "",
    wrapperClassName = "",
    ...rest
  },
  ref
) {
  const autoId = useId();
  const inputId = id || `input-${autoId}`;
  const isInvalid = Boolean(error);

  const [revealed, setRevealed] = useState(false);
  const hasToggle = passwordToggle && type === "password";
  const inputType = hasToggle && revealed ? "text" : type;
  const hasRightAdornment = Boolean(rightIcon) || hasToggle;

  const fieldClasses = [styles.field, isInvalid ? styles.invalid : "", wrapperClassName]
    .filter(Boolean)
    .join(" ");

  const inputClasses = [
    styles.input,
    leftIcon ? styles.hasLeftIcon : "",
    hasRightAdornment ? styles.hasRightIcon : "",
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
          type={inputType}
          className={inputClasses}
          aria-invalid={isInvalid || undefined}
          aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
          required={required}
          {...rest}
        />
        {hasToggle ? (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={revealed}
          >
            <Icon name={revealed ? "eye-off" : "eye"} size={16} />
          </button>
        ) : (
          rightIcon && <span className={styles.iconRight}>{rightIcon}</span>
        )}
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
