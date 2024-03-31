"use client";

import Link from "next/link";
import FormLogin from "@/components/FormLogin";
import { useSession } from "next-auth/react";
import { Spinner, useDisclosure } from "@nextui-org/react";
import ModalForgotPassword from "@/components/ModalForgotPassword";
import { useRouter } from "next/navigation";

const IniciarSesion = () => {
  const { status } = useSession();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();

  if (status === "authenticated") {
    return router.push("/");
  }

  return (
    <>
      {status === "loading" ? (
        <Spinner color="warning" className="flex justify-center p-5" />
      ) : (
        <>
          <div className="flex flex-col md:flex-row w-full h-screen">
            <div className="h-screen w-full flex items-center sm:items-none bg-fondo-comida-3 md:bg-none md:bg-[#f4f3f2] md:w-2/4 sm:p-10 md:p-5">
              <div className="w-full bg-[#f4f3f2] flex flex-col justify-center p-3 md:p-0 rounded">
                <h1 className="text-4xl font-bold p-7 text-orange-peel">
                  Accede a tu cuenta
                </h1>

                <FormLogin onOpen={onOpen} />

                <p className="text-center text-[#706967] text-xs flex justify-center gap-1">
                  Aún no tienes cuenta?{" "}
                  <Link
                    href={"/auth/register"}
                    className="text-orange-peel block font-bold hover:scale-90 transform transition-transform duration-[0.2s] ease-in-out"
                  >
                    Registrar
                  </Link>
                </p>
              </div>
            </div>
            <div className="md:w-2/4 w-full bg-fondo-comida-3"></div>
          </div>

          <ModalForgotPassword isOpen={isOpen} onOpenChange={onOpenChange} />
        </>
      )}
    </>
  );
};

export default IniciarSesion;
