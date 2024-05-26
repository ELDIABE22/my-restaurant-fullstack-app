"use client";

import { useRouter } from "next/navigation";
import { menuItemSchema } from "@/utils/validationSchema";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Link,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";

import axios from "axios";
import toast from "react-hot-toast";
import ModalMenuItem from "@/components/ModalMenuItem";
import ArrowLeftCircle from "@/components/icons/ArrowLeftCircle";
import CardImageMenuItem from "@/components/CardImageMenuItem";
import AccordionMenuItem from "@/components/AccordionMenuItem";
import ModalConfirmDeleteMenuItem from "@/components/ModalConfirmDeleteMenuItem";
import { useSession } from "next-auth/react";

const MenuItemNew = () => {
  const [itemImage, setItemImage] = useState({ file: null });
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [categorys, setCategorys] = useState([]);
  const [savingItem, setSavingItem] = useState(false);
  const [error, setError] = useState(null);

  // Estados del ModalMenuItem
  const [boxItem, setBoxItem] = useState([]);
  const [editBox, setEditBox] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para MondalConfirmDeleteMenuItem
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [modalData, setModalData] = useState(null);

  const { data: session, status } = useSession();

  const router = useRouter();

  const { onOpenChange } = useDisclosure();

  // función para crear menu-items
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavingItem(true);

    try {
      const data = menuItemSchema.parse({
        name: itemName,
        description: itemDescription,
        price: itemPrice,
        category: itemCategory,
        itemBox: boxItem,
      });

      setError(null);

      const formData = new FormData();

      formData.append("image", itemImage.file);

      formData.append("data", JSON.stringify(data));

      const res = await axios.post("/api/profile/menu-items", formData);

      const { message } = res.data;

      if (message === "Plato añadido") {
        toast.success(message);
        setError(null);
        router.push("/profile/menu-items");
      } else {
        toast.error(message);
      }

      setSavingItem(false);
    } catch (error) {
      console.log(error.message);
      const errors = error?.errors?.map((error) => error);
      setError(errors);

      if (errors?.some((error) => error.message.data)) {
        toast.error(errors?.find((error) => error.message.data)?.message?.data);
      }

      setSavingItem(false);
    }
  };

  // función para abrir y cerrar ModalMenuItem
  const handleOpenModal = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
  };

  // funciones para abrir y cerrar modal de confirmacion para eliminar menu-items
  const handleOpenModalDelete = (title, funcion, boxIndex, index) => {
    setIsModalOpenDelete(true);
    setModalData({ title, funcion, boxIndex, index });
  };

  const handleCloseModalDelete = () => {
    setIsModalOpenDelete(false);
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.admin === 1) {
        fetch("/api/category").then((res) => {
          res.json().then((data) => {
            setCategorys(data);
          });
        });
      } else {
        return router.push("/");
      }
    } else if (status === "unauthenticated") {
      return router.push("/");
    }
  }, [router, session?.user.admin, status]);

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <Button
        isDisabled={savingItem}
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

      <form onSubmit={handleSubmit} className="flex gap-4 p-3">
        <div>
          <CardImageMenuItem
            itemImage={itemImage}
            setItemImage={setItemImage}
            savingItem={savingItem}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Input
            isDisabled={savingItem}
            type="text"
            label="Nombre del elemento"
            color="warning"
            variant="bordered"
            autoComplete="off"
            isClearable
            value={itemName}
            onValueChange={setItemName}
            isInvalid={error?.some((error) => error.message.name)}
            errorMessage={
              error?.find((error) => error.message.name)?.message?.name
            }
          />
          <Textarea
            isDisabled={savingItem}
            label="Descripción"
            color="warning"
            variant="bordered"
            autoComplete="off"
            isClearable
            value={itemDescription}
            onValueChange={setItemDescription}
            isInvalid={error?.some((error) => error.message.description)}
            errorMessage={
              error?.find((error) => error.message.description)?.message
                ?.description
            }
          />
          <div className="flex gap-3">
            <Input
              isDisabled={savingItem}
              type="number"
              label="Precio base"
              color="warning"
              variant="bordered"
              autoComplete="off"
              isClearable
              value={itemPrice}
              onValueChange={setItemPrice}
              isInvalid={error?.some((error) => error.message.price)}
              errorMessage={
                error?.find((error) => error.message.price)?.message?.price
              }
            />
            <Autocomplete
              isDisabled={savingItem}
              label="Seleccionar categoría"
              color="warning"
              variant="bordered"
              onSelectionChange={(e) => {
                if (e === null) {
                  setItemCategory("");
                } else {
                  setItemCategory(e);
                }
              }}
              isInvalid={error?.some((error) => error.message.category)}
              errorMessage={
                error?.find((error) => error.message.category)?.message
                  ?.category
              }
            >
              {categorys.length > 0 &&
                categorys.map((cat) => (
                  <AutocompleteItem key={cat.id}>{cat.nombre}</AutocompleteItem>
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
                savingItem={savingItem}
              />
            ))}

          <Button
            isDisabled={savingItem}
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
            isLoading={savingItem}
          >
            <p className="text-white tracking-widest font-bold hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
              {savingItem ? "Guardando..." : "Guardar"}
            </p>
          </Button>
        </div>
      </form>

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

export default MenuItemNew;
