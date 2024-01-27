"use client";

import {
  Card,
  CardBody,
  CardFooter,
  Image,
  useDisclosure,
} from "@nextui-org/react";
import ModalMenu from "./ModalMenu";

export default function CardMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const list = [
    {
      title: "Pizza",
      img: "/fondo-comida2.png",
      price: "$5.000",
    },
    {
      title: "Hamburguesa",
      img: "/fondo-comida.png",
      price: "$20.000",
    },
    {
      title: "Perro Caliente",
      img: "/pizza.jpg",
      price: "$10.000",
    },
    {
      title: "Salchipapa",
      img: "/fondo-comida3.png",
      price: "$26.000",
    },
  ];

  return (
    <>
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
        {list.map((item, index) => (
          <Card
            className="max-w-[350px] min-w-[290px] sm:max-w-full sm:min-w-full hover:scale-90 transform transition-transform duration-[0.2s] ease-in-out"
            shadow="sm"
            key={index}
            isPressable
            onPress={onOpen}
          >
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt={item.title}
                className="w-full object-cover h-[140px]"
                src={item.img}
              />
            </CardBody>

            <CardFooter className="text-small justify-between">
              <b>{item.title}</b>
              <p className="text-default-500">{item.price}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
      <ModalMenu isOpen={isOpen} onClose={onClose} />
    </>
  );
}
