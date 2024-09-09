"use client"; // Marca o componente como Client Component
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const DashboardPage = () => {
  const [user, setUser] = useState<{ username: string } | null>(null); // Define o tipo de usuário
  const router = useRouter();
  const [protectedData, setProtectedData] = useState(null);

  const handleLogout = () => {
    // Remove o token JWT do localStorage
    localStorage.removeItem("token");

    // Redireciona o usuário para a página de login
    router.push("/login");
  };

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const token = localStorage.getItem("token");
    if (!token) {
      // Redireciona para a página de login se não estiver autenticado
      router.push("/login");
    } else {
      if (token) {
        // Busca os dados protegidos
        console.log("Token Dashboard:", token);
        axios
          .get("http://localhost:3001/api/protected-data/getProtectedData", {
            headers: {
              Authorization: `Bearer ${token}`, // Envia o token no cabeçalho da requisição
            },
          })
          .then((response) => {
            console.log("Resposta do backend protected:", response.data);
            setProtectedData(response.data); // Armazena os dados protegidos no estado
          })
          .catch((error) => {
            console.log("Resposta do backend protected erro:", error);
            console.error("Erro ao buscar dados protegidos:", error);
          });
      }

      try {
        // Decodifica o token JWT e pega o campo username
        const decodedToken: any = jwtDecode(token); // Decodifica o token JWT
        setUser({ username: decodedToken.username }); // Extrai o campo username
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        router.push("/login");
      }
    }
  }, [router]);

  if (!user) {
    return <p>Carregando...</p>; // Exibe enquanto o usuário está sendo carregado
  }

  return (
    <div>
      <h1>Bem-vindo à Dashboard, {user.username}!</h1>{" "}
      {protectedData ? (
        <div>Dados Protegidos: {JSON.stringify(protectedData)}</div>
      ) : (
        <p>Carregando dados...</p>
      )}
      <button onClick={handleLogout}>Logout</button> {/* Botão de logout */}
    </div>
  );
};

export default DashboardPage;
