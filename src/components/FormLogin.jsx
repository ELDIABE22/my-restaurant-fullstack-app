import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { MailIcon } from "./icons/MailIcon";
import { loginSchema } from "@/utils/validationSchema";
import { EyeFilledIcon } from "./icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./icons/EyeSlashFilledIcon";
import toast from "react-hot-toast";

const FormLogin = ({ onOpen }) => {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState(null);
  const [sesionLoading, setSesionLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

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
        localStorage.removeItem("cart");
        if (typeof window !== "undefined") {
          window.location.href = "/menu";
        }
      }

      setSesionLoading(false);
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setSesionLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 lg:p-7 mb-5 lg:mb-0">
        <div className="flex flex-col w-full mb-6 md:mb-0 gap-4">
          <Input
            isDisabled={sesionLoading}
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
            className="text-white"
          />
          <Input
            isDisabled={sesionLoading}
            type={isVisible ? "text" : "password"}
            label="Contraseña"
            color="warning"
            variant="bordered"
            autoComplete="off"
            value={contraseña}
            onValueChange={setContraseña}
            isInvalid={error?.some((error) => error.password)}
            errorMessage={error?.find((error) => error.password)?.password}
            className="text-white"
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
        <div className="flex">
          <p
            onClick={onOpen}
            className="text-orange-peel font-bold text-sm cursor-pointer "
          >
            ¿Olvidaste tu Contraseña?
          </p>
        </div>
        <div>
          <Button
            type="submit"
            color="warning"
            size="lg"
            variant="shadow"
            isLoading={sesionLoading}
            className="text-[15px] w-full"
          >
            <p className="text-white w-full tracking-widest font-bold hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
              {sesionLoading ? "Ingresando..." : "Ingresar"}
            </p>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormLogin;
