import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Trello 2.0",
  description: "Trello clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F5F6F8]">{children}</body>
    </html>
  );
}
