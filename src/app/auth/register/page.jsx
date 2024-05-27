"use client";

import Link from "next/link";
import FormRegister from "@/components/FormRegister";
import { useSession } from "next-auth/react";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const Registro = () => {
  const { status } = useSession();

  const router = useRouter();

  if (status === "authenticated") {
    return router.push("/");
  }

  return (
    <>
      {status === "loading" ? (
        <Spinner color="warning" className="flex justify-center p-5" />
      ) : (
        <div className="flex flex-col md:flex-row w-full min-h-screen">
          <div className="md:w-2/4 w-full bg-fondo-comida-3 md:min-h-screen"></div>
          <div className="min-h-screen w-full flex items-center sm:items-none bg-fondo-comida-3 md:bg-none md:bg-black md:w-2/4 sm:p-10 md:p-5">
            <div className="w-full bg-black flex flex-col justify-center p-3 md:p-0 rounded">
              <h1 className="text-4xl font-bold p-7 text-orange-peel">
                Registra tu cuenta
              </h1>

              <FormRegister />

              <p className="text-center text-[#f4f3f2] text-xs flex justify-center gap-1">
                Ya tienes una cuenta?{" "}
                <Link
                  href={"/auth/login"}
                  className="text-orange-peel block font-bold hover:scale-90 transform transition-transform duration-[0.2s] ease-in-out"
                >
                  Iniciar Sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Registro;
