import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import AuthLayout from "../../components/layout/AuthLayout/AuthLayout";
import { Button, Input, Icon } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const redirect  = location.state?.from?.pathname || "/app/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ username, password });
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Ingresa con tu cuenta para acceder a tu biblioteca."
      footer={<>¿Aún no tienes cuenta? <Link to="/register">Crear cuenta</Link></>}
    >
      <form className={styles.form} onSubmit={submit} noValidate>
        {error && <div className={styles.errorBox} role="alert">{error}</div>}

        <Input
          label="Usuario"
          autoComplete="username"
          required
          autoFocus
          leftIcon={<Icon name="user" size={16} />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Ingresar
        </Button>
      </form>
    </AuthLayout>
  );
}
