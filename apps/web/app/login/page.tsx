"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import styles from "./login.module.css";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include", // 🔑 cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Incorrect credentials. Please try again.");
        return;
      }

      const data = await response.json();
      const decoded: any = jwtDecode(data.accessToken);

      const role = decoded.role;

      if (role === "Administrator") {
        router.push("/dashboard/admin");
      } else if (role === "Scholar") {
        router.push("/dashboard/student/generate-contract");
      } else {
        setError("Unknown role. Contact support.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection error. Please try later.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.leftSection}>
          <h1 className={styles.title}>ScholarshipSuite</h1>

          <form className={styles.form} onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
            <button type="submit" className={styles.button}>
              Log in
            </button>
          </form>

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.rightSection}>
          <img
            src="/logo.jpg"
            alt="ScholarshipSuite Logo"
            className={styles.image}
          />
        </div>
      </div>
    </div>
  );
}
