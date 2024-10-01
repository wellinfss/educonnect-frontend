"use client"; // Marca o componente como Client Component

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import api from "../../services/api";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Enviando credenciais:", { username, password }); // Log das credenciais

    try {
      const response = await api.post(
        "http://localhost:3001/api/auth/login",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "Resposta do backend acess_token:",
        response.data.access_token
      ); // Log da resposta
      console.log(
        "Resposta do backend refresh_token:",
        response.data.refresh_token
      );

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
      }

      if (response.data.refresh_token) {
        localStorage.setItem("refresh_token", response.data.refresh_token);
      }

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      // Redireciona o usuário para a página inicial
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error); // Log do erro
      setError("Credenciais inválidas");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
