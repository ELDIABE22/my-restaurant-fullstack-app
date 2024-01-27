"use client";

import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { MailIcon } from "./icons/MailIcon";
import { useRouter } from "next/navigation";
import { GoogleIcon } from "./icons/GoogleIcon";
import { loginSchema } from "@/utils/validationSchema";
import { EyeFilledIcon } from "./icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./icons/EyeSlashFilledIcon";
import toast from "react-hot-toast";
import Link from "next/link";

const FormLogin = () => {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState(null);
  const [sesionLoading, setSesionLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSesionLoading(true);
    try {
      loginSchema.parse({
        correo,
        contraseña,
      });

      setError(null);

      const res = await signIn("credentials", {
        correo,
        contraseña,
        redirect: false,
      });

      if (res.error) {
        toast.error(res.error);
      }

      if (res.ok) {
        toast.success("Sesión iniciada");
        router.push("/menu");
        setSesionLoading(false);
      } else {
        setSesionLoading(false);
      }
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setSesionLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 p-7">
        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
          <Input
            type="email"
            label="Email"
            color="warning"
            variant="bordered"
            autoComplete="off"
            value={correo}
            onValueChange={setCorreo}
            isInvalid={error?.some((error) => error.email)}
            errorMessage={error?.find((error) => error.email)?.email}
            endContent={
              <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
        </div>
        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
          <Input
            type={isVisible ? "text" : "password"}
            label="Contraseña"
            color="warning"
            variant="bordered"
            autoComplete="off"
            value={contraseña}
            onValueChange={setContraseña}
            isInvalid={error?.some((error) => error.password)}
            errorMessage={error?.find((error) => error.password)?.password}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
          />
        </div>
        <div className="text-orange-peel font-bold text-sm ">
          <Link href={"#"} className="cursor-pointer ">
            ¿Olvidaste tu Contraseña?
          </Link>
        </div>
        <div className="flex flex-col flex-wrap gap-4">
          <Button
            type="submit"
            color="warning"
            size="lg"
            variant="shadow"
            isLoading={sesionLoading}
            className="text-[15px] m-[10px]"
          >
            <p className="text-white tracking-widest font-bold hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
              {sesionLoading ? "Ingresando..." : "Ingresar"}
            </p>
          </Button>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/menu" })}
            className="flex justify-center gap-3 bg-white mb-[5px] mr-[10px] ml-[10px] p-[14px] rounded-2xl cursor-pointer border"
          >
            <GoogleIcon />
            <p className="font-bold text-[15px] hover:scale-105 transform transition-transform duration-[0.2s] ease-in-out">
              Continuar con Google
            </p>
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormLogin;
