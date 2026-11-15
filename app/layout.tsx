import React from "react";
import "./globals.css"; // <-- ¡Esta línea es la que le da vida al diseño!

export const metadata = {
  title: "PAPACRUJ - Disfruta ligero",
  description: "Chips de taro artesanales",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}