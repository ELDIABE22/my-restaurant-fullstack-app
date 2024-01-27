"use client";

import AccordionMenuItem from "@/components/AccordionMenuItem";
import ModalMenuItem from "@/components/ModalMenuItem";
import ArrowLeftCircle from "@/components/icons/ArrowLeftCircle";
import PlusIcon from "@/components/icons/PlusIcon";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Link,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

const MenuItemNew = () => {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [categorys, setCategorys] = useState([]);
  const [savingItem, setSavingItem] = useState(false);

  // ESTADOS DEL AccordionMenuItem
  const [items, setItems] = useState([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    fetch("/api/category").then((res) => {
      res.json().then((data) => {
        setCategorys(data);
      });
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

      <form className="flex flex-col w-2/4 gap-4 p-3">
        <Input
          type="text"
          label="Nombre item"
          color="warning"
          variant="bordered"
          autoComplete="off"
          isClearable
          value={itemName}
          onValueChange={setItemName}
        />
        <Input
          type="text"
          label="Descripción"
          color="warning"
          variant="bordered"
          autoComplete="off"
          isClearable
          value={itemDescription}
          onValueChange={setItemDescription}
        />
        <div className="flex gap-3">
          <Input
            type="number"
            label="Precio base"
            color="warning"
            variant="bordered"
            autoComplete="off"
            isClearable
            value={itemPrice}
            onValueChange={setItemPrice}
          />
          <Autocomplete
            label="Seleccionar categoría"
            color="warning"
            variant="bordered"
            onInputChange={setItemCategory}
          >
            {categorys.length > 0 &&
              categorys.map((cat) => (
                <AutocompleteItem key={cat._id}>{cat.name}</AutocompleteItem>
              ))}
          </Autocomplete>
        </div>

        <AccordionMenuItem setItems={setItems} items={items} />

        <Button
          type="button"
          color="warning"
          size="lg"
          variant="ghost"
          radius="none"
          onPress={onOpen}
        >
          Agregar extra
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
      </form>

      <ModalMenuItem
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

export default MenuItemNew;
