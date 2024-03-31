/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import AccordionMenuItem from "@/components/AccordionMenuItem";
import CardImageMenuItem from "@/components/CardImageMenuItem";
import ModalConfirmDeleteMenuItem from "@/components/ModalConfirmDeleteMenuItem";
import ModalMenuItem from "@/components/ModalMenuItem";
import ArrowLeftCircle from "@/components/icons/ArrowLeftCircle";
import { menuItemSchema } from "@/utils/validationSchema";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Link,
  Spinner,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const MenuItemEdit = ({ params }) => {
  const [itemImage, setItemImage] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [boxItem, setBoxItem] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [updateItem, setUpdateItem] = useState(false);
  const [editBox, setEditBox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para ModalMenuItem
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Estado para MondalConfirmDeleteMenuItem
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  const { onOpenChange } = useDisclosure();

  const router = useRouter();

  // función para actualizar menu-items
  async function handleUpdate(e) {
    e.preventDefault();
    setUpdateItem(true);

    try {
      // const data = menuItemSchema.parse({
      //   name: itemName,
      //   description: itemDescription,
      //   price: itemPrice,
      //   category: itemCategory,
      //   itemBox: boxItem,
      // });

      setError(null);

      const formData = new FormData();

      if (itemImage.file) {
        formData.append("image", itemImage.file);
        formData.append("idRemoveImage", itemImage.image.public_id);
      } else {
        formData.append("image", itemImage.image.url);
        formData.append("idRemoveImage", itemImage.image.public_id);
      }

      formData.append("id", params.id);

      formData.append(
        "data",
        JSON.stringify({
          name: itemName,
          description: itemDescription,
          price: itemPrice,
          category: itemCategory,
          itemBox: boxItem,
        })
      );

      const res = await axios.put("/api/profile/menu-items", formData);

      const { message } = res.data;

      if (message === "Elemento actualizado exitosamente") {
        toast.success(message);
        setError(null);
        setUpdateItem(false);
        router.push("/profile/menu-items");
      } else if (message) {
        toast.error(message);
        setUpdateItem(false);
      } else {
        setUpdateItem(false);
      }
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);

      if (errors?.some((error) => error.data)) {
        toast.error(errors?.find((error) => error.data)?.data);
      }

      setUpdateItem(false);
    }
  }

  // función para eliminar el menu-items
  async function handleDelete() {
    const formData = new FormData();
    formData.append("idRemoveMenu", params.id);
    formData.append("idRemoveImage", itemImage.image.public_id);

    const promise = new Promise(async (resolve, reject) => {
      const res = await axios.delete("/api/profile/menu-items", {
        data: formData,
      });

      const { message } = res.data;

      if (message === "Menú de elemento eliminado") {
        resolve();
        router.push("/profile/menu-items");
      } else {
        reject();
      }
    });

    await toast.promise(promise, {
      loading: "Eliminando...",
      success: "Menú de elemento eliminado",
      error: "Error, inténtalo más tarde!",
    });
  }

  // función para abrir y cerrar ModalMenuItem
  function handleOpenModal() {
    if (isModalOpen) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
  }

  // funciones para abrir y cerrar modal de confirmacion para eliminar menu-items
  function handleOpenModalDelete(title, funcion, boxIndex, index) {
    setIsModalOpenDelete(true);
    setModalData({ title, funcion, boxIndex, index });
  }

  function handleCloseModalDelete() {
    setIsModalOpenDelete(false);
  }

  // useEffect para traer las categorias y datos del menu-items a actualizar
  useEffect(() => {
    const fetchProfileItems = fetch("/api/profile/menu-items").then((res) =>
      res.json()
    );
    const fetchCategories = fetch("/api/category").then((res) => res.json());

    Promise.all([fetchProfileItems, fetchCategories])
      .then(([profileItemsData, categoriesData]) => {
        const item = profileItemsData.find((item) => item._id === params.id);
        if (item) {
          setItemImage({ image: item.image, file: null });
          setItemName(item.name);
          setItemDescription(item.description);
          setItemPrice(item.price);
          setItemCategory(item.category);
          setBoxItem(item.itemBox);
        }

        setCategorys(categoriesData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <Button
        className="w-2/4"
        color="warning"
        variant="ghost"
        radius="none"
        as={Link}
        href="/profile/menu-items"
      >
        <ArrowLeftCircle />
        Mostrar todos los elementos del menú
      </Button>

      {loading ? (
        <Spinner label="Cargando elementos del menú..." color="warning" />
      ) : (
        <form className="flex gap-4 p-3" onSubmit={handleUpdate}>
          <div>
            <CardImageMenuItem
              itemImage={itemImage}
              setItemImage={setItemImage}
              params={params}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              label="Nombre del elemento"
              color="warning"
              variant="bordered"
              autoComplete="off"
              isClearable
              value={itemName}
              onValueChange={setItemName}
              isInvalid={error?.some((error) => error.name)}
              errorMessage={error?.find((error) => error.name)?.name}
            />
            <Textarea
              label="Descripción"
              color="warning"
              variant="bordered"
              autoComplete="off"
              isClearable
              value={itemDescription}
              onValueChange={setItemDescription}
              isInvalid={error?.some((error) => error.description)}
              errorMessage={
                error?.find((error) => error.description)?.description
              }
            />
            <div className="flex gap-3">
              <Input
                type="number"
                label="Precio base"
                min={1}
                color="warning"
                variant="bordered"
                autoComplete="off"
                isClearable
                value={itemPrice}
                onValueChange={setItemPrice}
                isInvalid={error?.some((error) => error.price)}
                errorMessage={error?.find((error) => error.price)?.price}
              />
              <Autocomplete
                label="Seleccionar categoría"
                color="warning"
                variant="bordered"
                value={itemCategory}
                onSelectionChange={(e) => {
                  if (e === null) {
                    setItemCategory("");
                  } else {
                    setItemCategory(e);
                  }
                }}
                isInvalid={error?.some((error) => error.category)}
                errorMessage={error?.find((error) => error.category)?.category}
              >
                {categorys.length > 0 &&
                  categorys.map((cat) => (
                    <AutocompleteItem key={cat._id}>
                      {cat.name}
                    </AutocompleteItem>
                  ))}
              </Autocomplete>
            </div>

            {boxItem?.length > 0 &&
              boxItem?.map((box, boxIndex) => (
                <AccordionMenuItem
                  key={boxIndex}
                  box={box}
                  boxIndex={boxIndex}
                  setBoxItem={setBoxItem}
                  handleOpenModal={handleOpenModal}
                  setEditBox={setEditBox}
                  error={error}
                  setError={setError}
                  handleOpenModalDelete={handleOpenModalDelete}
                />
              ))}

            <Button
              type="button"
              color="warning"
              size="lg"
              variant="ghost"
              radius="none"
              onPress={handleOpenModal}
            >
              Agregar caja de elemento
            </Button>

            <Button
              type="submit"
              color="warning"
              size="lg"
              variant="shadow"
              isLoading={updateItem}
            >
              <p className="text-white tracking-widest font-bold hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
                {updateItem ? "Actualizando..." : "Actualizar"}
              </p>
            </Button>
            <Button
              type="button"
              color="danger"
              size="lg"
              variant="shadow"
              onPress={() =>
                handleOpenModalDelete(
                  "¿Eliminar elemento de menú?",
                  handleDelete,
                  params.id,
                  null
                )
              }
            >
              <p className="text-white tracking-widest font-bold hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
                Eliminar
              </p>
            </Button>
          </div>
        </form>
      )}

      <ModalMenuItem
        isOpen={isModalOpen}
        handleOpenModal={handleOpenModal}
        onOpenChange={onOpenChange}
        boxItem={boxItem}
        setBoxItem={setBoxItem}
        editBox={editBox}
        setEditBox={setEditBox}
      />

      {isModalOpenDelete && (
        <ModalConfirmDeleteMenuItem
          isOpen={isModalOpenDelete}
          onClose={handleCloseModalDelete}
          onOpenChange={onOpenChange}
          modalData={modalData}
        />
      )}
    </div>
  );
};

export default MenuItemEdit;
