"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { profileSchema } from "@/utils/validationSchema";
import { useEffect, useState } from "react";
import { Button, Checkbox, Input, Spinner } from "@nextui-org/react";

import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { data: session, status } = useSession();
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [admin, setAdmin] = useState(null);
  const [updatingInfo, setUpdatingInfo] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSubmit = async () => {
    setUpdatingInfo(true);

    try {
      const data = profileSchema.parse({
        nombreCompleto,
        telefono,
        ciudad,
        direccion,
      });

      setError(null);

      const res = await axios.put("/api/profile", data);

      const { message } = res.data;

      if (message === "El teléfono ya existe!") {
        toast.error(message);
      }

      if (message === "Usuario actualizado exitosamente") {
        toast.success(message);
        setUpdatingInfo(false);
      } else {
        setUpdatingInfo(false);
      }
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setUpdatingInfo(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      setCorreo(session.user.correo);
      fetch("/api/profile").then((res) => {
        res.json().then((data) => {
          setNombreCompleto(data.nombreCompleto);
          setTelefono(data.telefono);
          setCiudad(data.ciudad);
          setDireccion(data.direccion);
          setAdmin(data.admin);
        });
        if (res) setLoadingProfile(false);
      });
    } else if (status === "unauthenticated") {
      setLoadingProfile(false);
      return router.push("/");
    }
  }, [router, session, status]);

  return (
    <div className="flex justify-center">
      {loadingProfile ? (
        <Spinner label="Cargando Perfil..." color="warning" />
      ) : (
        <form className="flex flex-col w-full lg:w-9/12 gap-4 p-3">
          <Input
            type="text"
            isDisabled={updatingInfo}
            label="Nombre Completo"
            color="warning"
            variant="bordered"
            autoComplete="off"
            isClearable
            value={nombreCompleto}
            onValueChange={setNombreCompleto}
            isInvalid={error?.some((error) => error.name)}
            errorMessage={error?.find((error) => error.name)?.name}
          />
          <Input
            type="email"
            label="Email"
            color="warning"
            variant="bordered"
            autoComplete="off"
            value={correo}
            onValueChange={setCorreo}
            isDisabled
          />
          <Input
            type="number"
            isDisabled={updatingInfo}
            label="Teléfono"
            color="warning"
            variant="bordered"
            autoComplete="off"
            isClearable
            value={telefono}
            onValueChange={setTelefono}
            isInvalid={error?.some((error) => error.phone)}
            errorMessage={error?.find((error) => error.phone)?.phone}
          />
          <div className="flex gap-3">
            <Input
              type="text"
              isDisabled={updatingInfo}
              label="Ciudad"
              color="warning"
              variant="bordered"
              autoComplete="off"
              isClearable
              value={ciudad}
              onValueChange={setCiudad}
              isInvalid={error?.some((error) => error.city)}
              errorMessage={error?.find((error) => error.city)?.city}
            />
            <Input
              type="text"
              isDisabled={updatingInfo}
              label="Dirección"
              color="warning"
              variant="bordered"
              autoComplete="off"
              isClearable
              value={direccion}
              onValueChange={setDireccion}
              isInvalid={error?.some((error) => error.address)}
              errorMessage={error?.find((error) => error.address)?.address}
            />
          </div>
          {admin === 1 && (
            <Checkbox defaultSelected={admin} color="warning" isDisabled>
              Admin
            </Checkbox>
          )}
          <Button
            type="submit"
            color="warning"
            size="lg"
            variant="shadow"
            isLoading={updatingInfo}
            onPress={handleSubmit}
          >
            <p className="text-white w-full tracking-widest font-bold hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
              {updatingInfo ? "Guardando..." : "Guardar"}
            </p>
          </Button>
        </form>
      )}
    </div>
  );
};

export default Profile;
