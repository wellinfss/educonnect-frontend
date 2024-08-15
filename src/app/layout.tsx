// app/layout.tsx
import "./globals.css";
import React from "react";

export const metadata = {
  title: "EduConnect",
  description: "Plataforma de aprendizado online interativo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
