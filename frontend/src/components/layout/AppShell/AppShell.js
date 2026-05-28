import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./AppShell.module.css";
import Sidebar from "../Sidebar/Sidebar";
import Topbar  from "../Topbar/Topbar";

export default function AppShell() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
