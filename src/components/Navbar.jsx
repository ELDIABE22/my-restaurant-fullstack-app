"use client";

import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import CarritoIcon from "./icons/CarritoIcon";
import { useOrder } from "@/context/OrderContext";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { status } = useSession();
  const pathname = usePathname();
  const { cart } = useOrder();

  return (
    <Navbar
      className={pathname === "/" ? "dark fixed top-0" : "dark"}
      isBlurred={pathname === "/" ? true : false}
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          className="text-white"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit text-white">DIABE</p>
          <p className="font-bold text-inherit text-orange-peel">DELICIAS</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit text-white">DIABE</p>
          <p className="font-bold text-inherit text-orange-peel">DELICIAS</p>
        </NavbarBrand>
        <NavbarItem isActive={pathname === "/"}>
          <Link
            href="/"
            className={
              pathname === "/"
                ? "text-orange-peel"
                : "text-white hover:text-orange-peel"
            }
          >
            Inicio
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/menu"}>
          <Link
            href="/menu"
            aria-current="page"
            className={
              pathname === "/menu"
                ? "text-orange-peel"
                : "text-white hover:text-orange-peel"
            }
          >
            Menu
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/orders"}>
          <Link
            href="/orders"
            className={
              pathname === "/orders"
                ? "text-orange-peel"
                : "text-white hover:text-orange-peel"
            }
          >
            Pedidos
          </Link>
        </NavbarItem>
      </NavbarContent>

      {status === "unauthenticated" && (
        <NavbarContent justify="end">
          <NavbarItem className="hidden sm:flex">
            <Link
              href="/auth/login"
              className={
                pathname === "/auth/login"
                  ? "text-green-500"
                  : "text-white hover:text-green-500"
              }
            >
              Iniciar Sesión
            </Link>
          </NavbarItem>
          <NavbarItem className="hidden lg:flex">
            <Button
              as={Link}
              color="warning"
              href="/auth/register"
              variant="flat"
            >
              Registrarse
            </Button>
          </NavbarItem>
          <NavbarItem className="relative sm:border-l-1 sm:border-gray-700 sm:pl-4 sm:ml-2 cursor-pointer">
            <CarritoIcon />
            <div className="absolute h-4 w-4 rounded-full sm:-top-1 sm:left-7 -top-1 left-4 font-semibold bg-orange-peel flex items-center justify-center text-sm">
              {cart.length}
            </div>
          </NavbarItem>
        </NavbarContent>
      )}

      {status === "authenticated" && (
        <NavbarContent justify="end">
          <NavbarItem
            isActive={pathname.includes("/profile")}
            className="hidden sm:flex"
          >
            <Link
              href="/profile"
              className={
                pathname.includes("/profile")
                  ? "text-orange-peel"
                  : "text-white hover:text-orange-peel"
              }
            >
              Perfil
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Button
              className="hidden sm:flex"
              as={Link}
              color="danger"
              // href="/"
              variant="flat"
              onClick={() => signOut()}
            >
              Cerrar Sesión
            </Button>
          </NavbarItem>
          <NavbarItem className="relative sm:border-l-1 sm:border-gray-700 sm:pl-4 sm:ml-2 cursor-pointer">
            <CarritoIcon />
            <div className="absolute h-4 w-4 rounded-full sm:-top-1 sm:left-7 -top-1 left-4 font-semibold bg-orange-peel flex items-center justify-center text-sm">
              9
            </div>
          </NavbarItem>
        </NavbarContent>
      )}

      {/* Navbar menu responsive */}
      {status === "authenticated" && (
        <NavbarMenu className="dark">
          <NavbarMenuItem>
            <Link
              className={
                pathname === "/"
                  ? "text-orange-peel w-full"
                  : "text-white hover:text-orange-peel w-full"
              }
              href="/"
              size="lg"
            >
              Inicio
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className={
                pathname === "/profile"
                  ? "text-orange-peel w-full"
                  : "text-white hover:text-orange-peel w-full"
              }
              href="/profile"
              size="lg"
            >
              Perfil
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className={
                pathname === "/menu"
                  ? "text-orange-peel w-full"
                  : "text-white hover:text-orange-peel w-full"
              }
              href="/menu"
              size="lg"
            >
              Menu
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className={
                pathname === "/orders"
                  ? "text-orange-peel w-full"
                  : "text-white hover:text-orange-peel w-full"
              }
              href="/orders"
              size="lg"
            >
              Pedidos
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className="w-full cursor-pointer"
              color="danger"
              onClick={() => signOut()}
              // href="#"
              size="lg"
            >
              Cerrar Sesión
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>
      )}

      {status === "unauthenticated" && (
        <NavbarMenu className="dark">
          <NavbarMenuItem>
            <Link
              className={
                pathname === "/"
                  ? "text-orange-peel w-full"
                  : "text-white hover:text-orange-peel w-full"
              }
              href="/"
              size="lg"
            >
              Inicio
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className={
                pathname === "/menu"
                  ? "text-orange-peel w-full"
                  : "text-white hover:text-orange-peel w-full"
              }
              href="/menu"
              size="lg"
            >
              Menu
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className={
                pathname === "/orders"
                  ? "text-orange-peel w-full"
                  : "text-white hover:text-orange-peel w-full"
              }
              href="/orders"
              size="lg"
            >
              Pedidos
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem className="flex gap-2">
            <Button
              as={Link}
              variant="flat"
              color="success"
              href="/auth/login"
              className="w-full"
            >
              Iniciar Sesión
            </Button>
            <Button
              as={Link}
              color="warning"
              href="/auth/register"
              variant="flat"
              className="w-full"
            >
              Registrarse
            </Button>
          </NavbarMenuItem>
        </NavbarMenu>
      )}
    </Navbar>
  );
}
