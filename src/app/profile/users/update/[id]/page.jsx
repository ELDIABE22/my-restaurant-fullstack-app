"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { profileSchema } from "@/utils/validationSchema";
import { useEffect, useState } from "react";
import { Button, Checkbox, Input, Spinner } from "@nextui-org/react";

import axios from "axios";
import toast from "react-hot-toast";

const UserUpdatePage = ({ params }) => {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingInfo, setUpdatingInfo] = useState(false);
  const [error, setError] = useState(null);

  const { data: session, status } = useSession();

  const router = useRouter();

  async function handleUpdate() {
    setUpdatingInfo(true);

    try {
      profileSchema.parse({
        nombreCompleto,
        telefono,
        ciudad,
        direccion,
      });

      setError(null);

      const data = {
        id: params.id,
        nombreCompleto,
        telefono,
        ciudad,
        direccion,
        admin,
      };

      const res = await axios.put("/api/profile/users", data);

      const { message } = res.data;

      if (message === "Usuario actualizado") {
        toast.success(message);
        router.push("/profile/users");
        setUpdatingInfo(false);
      } else if (message) {
        toast.error(message);
        setUpdatingInfo(false);
      } else {
        setUpdatingInfo(false);
      }
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setUpdatingInfo(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.admin === 1) {
        fetch(`/api/profile/users/update/${params.id}`).then((res) => {
          res.json().then((data) => {
            setNombreCompleto(data.nombreCompleto);
            setCorreo(data.correo);
            setTelefono(data.telefono);
            setCiudad(data.ciudad);
            setDireccion(data.direccion);
            setAdmin(data.admin);

            if (res) setLoading(false);
          });
        });
      } else {
        setLoading(false);
        return router.push("/");
      }
    } else if (status === "unauthenticated") {
      setLoading(false);
      return router.push("/");
    }
  }, [params.id, router, session?.user.admin, status]);

  return (
    <div className="flex justify-center">
      {loading ? (
        <Spinner label="Cargando información..." color="warning" />
      ) : (
        <form className="flex flex-col lg:w-9/12 gap-4 p-3">
          <Input
            isDisabled={updatingInfo}
            type="text"
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
            isDisabled={updatingInfo}
            type="email"
            label="Email"
            color="warning"
            variant="bordered"
            autoComplete="off"
            value={correo}
            onValueChange={setCorreo}
          />
          <Input
            isDisabled={updatingInfo}
            type="number"
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
              isDisabled={updatingInfo}
              type="text"
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
              isDisabled={updatingInfo}
              type="text"
              label="Dirección"
              color="warning"
              variant="bordered"
              autoComplete="off"
              isClearable
              value={direccion}
              onValueChange={setDireccion}
            />
          </div>
          {session?.user.admin && (
            <Checkbox
              isDisabled={updatingInfo}
              defaultSelected={admin}
              color="warning"
              isSelected={admin}
              onValueChange={setAdmin}
            >
              Admin
            </Checkbox>
          )}
          <Button
            type="submit"
            color="warning"
            size="lg"
            variant="shadow"
            isLoading={updatingInfo}
            onPress={handleUpdate}
          >
            <p className="text-white tracking-widest font-bold hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
              {updatingInfo ? "Actualizando..." : "Actualizar"}
            </p>
          </Button>
        </form>
      )}
    </div>
  );
};

export default UserUpdatePage;
