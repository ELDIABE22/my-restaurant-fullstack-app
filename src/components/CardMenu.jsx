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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalDataItem, setModalDataItem] = useState(null);

  return (
    <>
      <Card
        className="max-w-[350px] min-w-[290px] sm:max-w-full sm:min-w-full hover:scale-90 transform transition-transform duration-[0.2s] ease-in-out"
        shadow="sm"
        isPressable
        onPress={() => {
          onOpen();
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
            <b>$ </b>
            {item.price.toLocaleString()}
          </p>
        </CardFooter>
      </Card>
      <ModalMenu
        isOpen={isOpen}
        onClose={onClose}
        modalDataItem={modalDataItem}
      />
    </>
  );
}
