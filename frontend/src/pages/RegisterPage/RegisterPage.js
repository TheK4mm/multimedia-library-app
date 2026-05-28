import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout/AuthLayout";
import { Button, Input, Icon, useToast } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import styles from "../LoginPage/LoginPage.module.css";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast    = useToast();

  const [form, setForm] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const update = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const submit = async (event) => {
    event.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      await register({
        username:    form.username,
        password:    form.password,
        email:       form.email || undefined,
        displayName: form.displayName || undefined,
      });
      toast.success("Cuenta creada. ¡Bienvenido!");
      navigate("/app/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "No se pudo completar el registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Empieza tu biblioteca personal en segundos."
      footer={<>¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></>}
    >
      <form className={styles.form} onSubmit={submit} noValidate>
        {error && <div className={styles.errorBox} role="alert">{error}</div>}

        <Input
          label="Usuario"
          autoComplete="username"
          required
          autoFocus
          leftIcon={<Icon name="user" size={16} />}
          value={form.username}
          onChange={(e) => update("username", e.target.value)}
          helpText="Mínimo 3 caracteres."
        />

        <Input
          label="Nombre para mostrar"
          value={form.displayName}
          onChange={(e) => update("displayName", e.target.value)}
          placeholder="Cómo deseas que te llamemos"
        />

        <Input
          label="Email (opcional)"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />

        <Input
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          required
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          helpText="Mínimo 6 caracteres."
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          required
          value={form.confirm}
          onChange={(e) => update("confirm", e.target.value)}
        />

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Crear cuenta
        </Button>
      </form>
    </AuthLayout>
  );
}
