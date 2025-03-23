import type { Metadata } from "next";
//import "./globals.css";
import '@/lib/assets/style.scss';
import { AntdRegistry } from '@ant-design/nextjs-registry';


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <div className="app-container">
          <AntdRegistry>{children}</AntdRegistry>
        </div>
      </body>
    </html>
  );
}
