"use client";

import { usePathname } from "next/navigation";
import { Tab, Tabs } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const NavbarProfile = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState("perfil");

  // Actualizar el tab activo basado en la ruta actual
  useEffect(() => {
    if (
      pathname.startsWith("/profile/menu-items") ||
      pathname.startsWith("/profile/users")
    ) {
      if (pathname.startsWith("/profile/menu-items")) {
        setActiveTab("menu-items");
      } else if (pathname.startsWith("/profile/users")) {
        setActiveTab("users");
      }
    } else {
      switch (pathname) {
        case "/profile":
          setActiveTab("perfil");
          break;
        case "/profile/categories":
          setActiveTab("categories");
          break;
        case "/profile/coupons":
          setActiveTab("coupons");
          break;
        case "/profile/orders":
          setActiveTab("orders");
          break;
        default:
          setActiveTab("perfil");
      }
    }
  }, [pathname]);

  return (
    <>
      {session?.user?.admin ? (
        <nav className="text-center my-6">
          <Tabs
            aria-label="Options"
            key="perfil"
            color="warning"
            variant="bordered"
            selectedKey={activeTab}
          >
            <Tab key="perfil" href="/profile">
              Perfil
            </Tab>
            <Tab key="categories" href="/profile/categories">
              Categorias
            </Tab>
            <Tab key="menu-items" href="/profile/menu-items">
              Elementos de menú
            </Tab>
            <Tab key="coupons" href="/profile/coupons">
              Cupones
            </Tab>
            <Tab key="users" href="/profile/users">
              Usuarios
            </Tab>
            <Tab key="orders" href="/profile/orders">
              Ordenes
            </Tab>
          </Tabs>
        </nav>
      ) : (
        <h2 className="text-center my-6 text-3xl text-orange-peel font-bold tracking-widest">
          Perfil
        </h2>
      )}
    </>
  );
};

export default NavbarProfile;
