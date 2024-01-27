import Link from "next/link";
import FormRegister from "@/components/FormRegister";

const Registro = () => {
  return (
    <div className="flex h-screen">
      <div className="w-2/4 bg-fondo-comida-3"></div>
      <div className="w-2/4 p-10 flex flex-col bg-[#f4f3f2]">
        <h1 className="text-4xl font-bold p-7 text-orange-peel">
          Registra tu cuenta
        </h1>

        <FormRegister />

        <p className="text-center text-[#706967] text-xs flex justify-center gap-1">
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
  );
};

export default Registro;
