import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {NextAuthProvider} from "@/app/provider";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import LogInOutButton from "@/app/components/LogInOutButton";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
      <NextAuthProvider>
          <Navbar maxWidth="full">
              <NavbarBrand>
                  <a href={"/"}><p className="font-bold text-inherit">CompTotal</p></a>

              </NavbarBrand>

              <NavbarContent justify="end" >
                  <NavbarItem>
                      <LogInOutButton />
                  </NavbarItem>
              </NavbarContent>
          </Navbar>
          {children}
      </NextAuthProvider>
      </body>
</html>

)
    ;
}