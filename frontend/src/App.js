import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/ui";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicOnlyRoute from "./components/common/PublicOnlyRoute";

import AppShell        from "./components/layout/AppShell/AppShell";
import LoginPage       from "./pages/LoginPage/LoginPage";
import RegisterPage    from "./pages/RegisterPage/RegisterPage";
import DashboardPage   from "./pages/DashboardPage/DashboardPage";
import CatalogPage     from "./pages/CatalogPage/CatalogPage";
import ItemDetailPage  from "./pages/ItemDetailPage/ItemDetailPage";
import ItemFormPage    from "./pages/ItemFormPage/ItemFormPage";
import StatsPage       from "./pages/StatsPage/StatsPage";
import ProfilePage     from "./pages/ProfilePage/ProfilePage";
import NotFoundPage    from "./pages/NotFoundPage/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

            <Route path="/login"
                   element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
            <Route path="/register"
                   element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

            <Route path="/app"
                   element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
              <Route index            element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="catalog"   element={<CatalogPage />} />
              <Route path="stats"     element={<StatsPage />} />
              <Route path="profile"   element={<ProfilePage />} />
              <Route path="items/new"           element={<ItemFormPage mode="create" />} />
              <Route path="items/:id"           element={<ItemDetailPage />} />
              <Route path="items/:id/edit"      element={<ItemFormPage mode="edit" />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
