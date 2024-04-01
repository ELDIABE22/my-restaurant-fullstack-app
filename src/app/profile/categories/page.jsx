"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Input, Spinner } from "@nextui-org/react";
import { categorySchema } from "@/utils/validationSchema";
import { useEffect, useState } from "react";
import CategoryTable from "@/components/CategoryTable";
import toast from "react-hot-toast";
import axios from "axios";

const Categories = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [categorys, setCategorys] = useState([]);
  const [editedCategory, setEditedCategory] = useState(null);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(true);

  const { data: session, status } = useSession();

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editedCategory) {
      setUpdatingCategory(true);
      try {
        const validatedCategory = categorySchema.parse({ name });

        setError(null);

        const data = { id: editedCategory._id, name: validatedCategory.name };

        const res = await axios.put("/api/category", data);

        const { message } = res.data;

        if (message === "La categoría ya existe!") {
          toast.error(message);
        }

        if (message === "Categoría actualizada") {
          setName("");
          getCategory();
          toast.success(message);
          setEditedCategory(null);
          setUpdatingCategory(false);
        } else {
          setUpdatingCategory(false);
        }
      } catch (error) {
        const errors = error?.errors?.map((error) => error.message);
        setError(errors);
        setUpdatingCategory(false);
      }
    } else {
      setCreatingCategory(true);
      try {
        const validatedCategory = categorySchema.parse({ name });

        setError(null);

        const res = await axios.post("/api/category", validatedCategory);

        const { message } = res.data;

        if (message === "La categoría ya existe!") {
          toast.error(message);
        }

        if (message === "Categoría creada") {
          setName("");
          getCategory();
          toast.success(message);
          setCreatingCategory(false);
        } else {
          setCreatingCategory(false);
        }
      } catch (error) {
        const errors = error?.errors?.map((error) => error.message);
        setError(errors);
        setCreatingCategory(false);
      }
    }
  };

  const getCategory = async () => {
    try {
      const res = await axios.get("/api/category");
      setCategorys(res.data);
      if (res) setLoadingCategory(false);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.admin) {
        getCategory();
      } else {
        return router.push("/");
      }
    } else if (status === "unauthenticated") {
      return router.push("/");
    }
  }, [router, session?.user.admin, status]);

  return (
    <>
      {status === "loading" ? (
        <Spinner color="warning" className="flex justify-center" />
      ) : (
        <div className="flex flex-col justify-center items-center gap-5">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 min-w-[500px]"
          >
            <Input
              type="text"
              label={
                editedCategory ? "Actualizar Categoría" : "Nueva categoría"
              }
              color="warning"
              variant="bordered"
              radius="none"
              size="sm"
              autoComplete="off"
              isClearable
              value={name}
              onValueChange={setName}
              isInvalid={error?.some((error) => error.name)}
              errorMessage={error?.find((error) => error.name)?.name}
            />
            <Button
              type="submit"
              color="warning"
              size="lg"
              variant="ghost"
              radius="none"
              isLoading={creatingCategory}
            >
              {editedCategory
                ? updatingCategory
                  ? "Actualizando..."
                  : "Actualizar"
                : creatingCategory
                ? "Creando..."
                : "Crear"}
            </Button>
            {editedCategory && (
              <Button
                type="button"
                color="danger"
                radius="none"
                variant="shadow"
                size="lg"
                onPress={() => {
                  setEditedCategory(null);
                  setName("");
                  setError(null);
                }}
              >
                Cancelar
              </Button>
            )}
          </form>

          <CategoryTable
            categorys={categorys}
            setName={setName}
            setEditedCategory={setEditedCategory}
            getCategory={getCategory}
            loadingCategory={loadingCategory}
            setError={setError}
          />
        </div>
      )}
    </>
  );
};

export default Categories;
