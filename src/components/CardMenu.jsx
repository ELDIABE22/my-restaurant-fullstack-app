"use client";

import {
  Card,
  CardBody,
  CardFooter,
  Image,
  useDisclosure,
} from "@nextui-org/react";
import ModalMenu from "./ModalMenu";
import { useState } from "react";

export default function CardMenu({ item }) {
  const [selectedBoxElements, setSelectedBoxElements] = useState([]);
  const [element, setElement] = useState({});
  const [modalDataItem, setModalDataItem] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Agrega un elemento al preCarrito, incrementando la cantidad si el elemento ya existe y su cantidad es menor a 10, o añadiéndolo con una cantidad de 1 si no existe.
  function AddElement(item) {
    setElement((prevElement) => {
      if (prevElement && prevElement.name === item.name) {
        if (prevElement.amount >= 10) {
          return prevElement;
        } else {
          const newTotal = (prevElement.amount + 1) * item.price;
          return {
            ...prevElement,
            amount: prevElement.amount + 1,
            total: newTotal,
          };
        }
      } else {
        const initialTotal = item.price;

        return {
          name: item.name,
          image: item.image.url,
          amount: 1,
          total: initialTotal,
        };
      }
    });
  }

  // Elimina un elemento del preCarrito, decrementando la cantidad si es mayor a 1, o eliminándolo si la cantidad es 1.
  function RemoveElement(item) {
    setElement((prevElement) => {
      if (
        prevElement &&
        prevElement.name === item.name &&
        prevElement.amount > 1
      ) {
        const newTotal = (prevElement.amount - 1) * item.price;
        return {
          ...prevElement,
          amount: prevElement.amount - 1,
          total: newTotal,
        };
      } else {
        return null;
      }
    });
  }

  // Calcula el total de los elementos en el carrito que cumplen con ciertos criterios, sumando el producto de la cantidad y el precio de cada elemento.
  function calculateTotal() {
    let total = 0;
    selectedBoxElements.forEach(
      (item) => item.typeSelect === "1" && (total += item.amount * item.price)
    );
    return total;
  }

  return (
    <>
      <Card
        className="max-w-[350px] min-w-[290px] sm:max-w-full sm:min-w-full hover:scale-90 transform transition-transform duration-[0.2s] ease-in-out"
        shadow="sm"
        isPressable
        onPress={() => {
          onOpen();
          AddElement(item);
          setModalDataItem(item);
        }}
      >
        <CardBody className="overflow-visible p-0">
          <Image
            shadow="sm"
            radius="lg"
            width="100%"
            alt={item.name}
            className="w-full object-cover h-[140px]"
            src={item.image.url}
          />
        </CardBody>

        <CardFooter className="text-small justify-between">
          <b>{item.name}</b>
          <p className="text-default-500">
            {item.price.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}
          </p>
        </CardFooter>
      </Card>
      <ModalMenu
        isOpen={isOpen}
        onClose={onClose}
        item={item}
        modalDataItem={modalDataItem}
        selectedBoxElements={selectedBoxElements}
        setSelectedBoxElements={setSelectedBoxElements}
        element={element}
        setElement={setElement}
        AddElement={AddElement}
        RemoveElement={RemoveElement}
        calculateTotal={calculateTotal}
      />
    </>
  );
}
