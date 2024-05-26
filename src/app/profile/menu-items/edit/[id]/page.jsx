"use client";

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
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import ModalMenuItem from "@/components/ModalMenuItem";
import ArrowLeftCircle from "@/components/icons/ArrowLeftCircle";
import CardImageMenuItem from "@/components/CardImageMenuItem";
import AccordionMenuItem from "@/components/AccordionMenuItem";
import ModalConfirmDeleteMenuItem from "@/components/ModalConfirmDeleteMenuItem";

const MenuItemEdit = ({ params }) => {
  const [itemImage, setItemImage] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [boxItem, setBoxItem] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [editBox, setEditBox] = useState(null);

  const [updateItem, setUpdateItem] = useState(false);
  const [deleteEvent, setDeleteEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para ModalMenuItem
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Estado para MondalConfirmDeleteMenuItem
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  const { data: session, status } = useSession();

  const { onOpenChange } = useDisclosure();

  const router = useRouter();

  // función para actualizar menu-items
  async function handleUpdate(e) {
    e.preventDefault();
    setUpdateItem(true);

    try {
      setError(null);

      const formData = new FormData();

      if (itemImage.file) {
        formData.append("image", itemImage.file);
      } else {
        formData.append("image", itemImage.image);
      }

      formData.append("imageRemove", itemImage.imageRemove);

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

      if (message === "Plato actualizado") {
        toast.success(message);
        setError(null);
        router.push("/profile/menu-items");
      } else {
        toast.error(message);
      }

      setUpdateItem(false);
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
    setDeleteEvent(true);

    const formData = new FormData();
    formData.append("idRemoveMenu", params.id);
    formData.append("imageRemove", itemImage.imageRemove);

    const promise = new Promise(async (resolve, reject) => {
      const res = await axios.delete("/api/profile/menu-items", {
        data: formData,
      });

      const { message } = res.data;

      if (message === "Plato eliminado") {
        resolve();
        setDeleteEvent(false);
        router.push("/profile/menu-items");
      } else {
        reject();
        setDeleteEvent(false);
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

  const getItem = async () => {
    try {
      const resMenuItem = await axios.get(
        `/api/profile/menu-items/${params.id}`
      );
      const { data: dataMenuItem } = resMenuItem;

      const resCategory = await axios.get(`/api/category`);
      const { data: dataCategory } = resCategory;

      // Crear el objeto principal del plato
      const plato = {
        id: dataMenuItem[0].plato_id,
        imagen_url: dataMenuItem[0].imagen_url,
        nombre: dataMenuItem[0].plato_nombre,
        descripcion: dataMenuItem[0].plato_descripcion,
        precio: dataMenuItem[0].plato_precio,
        categoria: {
          id: dataMenuItem[0].categoria_id,
          nombre: dataMenuItem[0].categoria_nombre,
        },
      };

      // Crear un mapa para los plato_caja por id
      const cajasMap = new Map();

      dataMenuItem.forEach((row) => {
        // Verificar si hay plato_caja_id y plato_caja_item_id presentes
        if (row.plato_caja_id && row.plato_caja_item_id) {
          // Si el plato_caja ya existe, añadir el item a la caja
          if (cajasMap.has(row.plato_caja_id)) {
            const caja = cajasMap.get(row.plato_caja_id);
            caja.dataMenuItem.push({
              id: row.plato_caja_item_id,
              nombre: row.plato_caja_item_nombre,
              precio: row.plato_caja_item_precio,
              tipo: row.plato_caja_item_tipo,
            });
          } else {
            // Si el plato_caja no existe, crear una nueva entrada
            const caja = {
              id: row.plato_caja_id,
              nombre: row.plato_caja_nombre,
              descripcion: row.plato_caja_descripcion,
              cantidad_maxima: row.plato_caja_cantidad_maxima,
              dataMenuItem: [
                {
                  id: row.plato_caja_item_id,
                  nombre: row.plato_caja_item_nombre,
                  precio: row.plato_caja_item_precio,
                  tipo: row.plato_caja_item_tipo,
                },
              ],
            };
            cajasMap.set(row.plato_caja_id, caja);
          }
        }
      });

      // Convertir el mapa a un array y añadirlo al plato si hay cajas
      const cajasArray = Array.from(cajasMap.values());
      plato.cajas = cajasArray;

      setItemImage({ image: plato.imagen_url, file: null });
      setItemName(plato.nombre);
      setItemDescription(plato.descripcion);
      setItemPrice(plato.precio);
      setItemCategory(plato.categoria.id);

      setBoxItem(plato.cajas);

      setCategorys(dataCategory);

      setLoading(false);
    } catch (error) {
      console.log("Error, intentar más tarde: " + error.message);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.admin === 1) {
        getItem();
      } else {
        return router.push("/");
      }
    } else if (status === "unauthenticated") {
      return router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.admin, status]);

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <Button
        isDisabled={updateItem || deleteEvent}
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
              updateItem={updateItem}
              deleteEvent={deleteEvent}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Input
              isDisabled={updateItem || deleteEvent}
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
              isDisabled={updateItem || deleteEvent}
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
                isDisabled={updateItem || deleteEvent}
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
                isDisabled={updateItem || deleteEvent}
                label="Seleccionar categoría"
                color="warning"
                variant="bordered"
                selectedKey={itemCategory}
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
                    <AutocompleteItem key={cat.id}>
                      {cat.nombre}
                    </AutocompleteItem>
                  ))}
              </Autocomplete>
            </div>

            {boxItem?.length > 0 &&
              boxItem.map((box, boxIndex) => (
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
                  updateItem={updateItem}
                  deleteEvent={deleteEvent}
                />
              ))}

            <Button
              isDisabled={updateItem || deleteEvent}
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
              isDisabled={deleteEvent}
            >
              <p className="text-white w-full tracking-widest font-bold hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
                {updateItem ? "Actualizando..." : "Actualizar"}
              </p>
            </Button>
            <Button
              isDisabled={updateItem}
              isLoading={deleteEvent}
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
              <p className="text-white w-full tracking-widest font-bold hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
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
