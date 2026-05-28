import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, EmptyState, Icon } from "../../components/ui";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: "var(--space-12)" }}>
      <EmptyState
        icon={<Icon name="search" size={28} />}
        title="Página no encontrada"
        description="La ruta que buscas no existe o fue movida."
        action={<Button onClick={() => navigate("/app/dashboard")}>Volver al inicio</Button>}
      />
    </div>
  );
}
