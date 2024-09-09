// app/page.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
  const router = useRouter();

  const handleLogin = () => {
    // Lógica para realizar o loginrouter.push("/login");
    router.push("/login");
  };

  return (
    <div>
      <h1>Bem-vindo ao EduConnect!</h1>
      <p>Plataforma de aprendizado online interativo.</p>
      <button onClick={handleLogin}>Login</button> {/* Botão de logout */}
    </div>
  );
};

export default Home;
