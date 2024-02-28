"use client";

import { usePathname } from "next/navigation";
import { Button, ButtonGroup } from "@nextui-org/react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const NavbarProfile = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <>
      {session?.user?.admin ? (
        <nav className="text-center my-6">
          <ButtonGroup variant="shadow">
            <Button
              as={Link}
              href="/profile"
              className={
                pathname === "/profile"
                  ? "bg-orange-peel font-semibold"
                  : "hover:bg-orange-peel font-normal"
              }
            >
              Perfil
            </Button>
            <Button
              as={Link}
              href="/profile/categories"
              className={
                pathname === "/profile/categories"
                  ? "bg-orange-peel font-semibold"
                  : "hover:bg-orange-peel font-normal"
              }
            >
              Categorias
            </Button>
            <Button
              as={Link}
              href="/profile/menu-items"
              className={
                pathname.includes("/menu-items")
                  ? "bg-orange-peel font-semibold"
                  : "hover:bg-orange-peel font-normal"
              }
            >
              Elementos de menú
            </Button>
            <Button
              as={Link}
              href="/profile/users"
              className={
                pathname.includes("/users")
                  ? "bg-orange-peel font-semibold"
                  : "hover:bg-orange-peel font-normal"
              }
            >
              Usuarios
            </Button>
            <Button
              as={Link}
              href="/profile/orders"
              className={
                pathname === "/profile/orders"
                  ? "bg-orange-peel font-semibold"
                  : "hover:bg-orange-peel font-normal"
              }
            >
              Ordenes
            </Button>
          </ButtonGroup>
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
