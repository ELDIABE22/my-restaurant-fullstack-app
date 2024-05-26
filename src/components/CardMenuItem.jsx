import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import Link from "next/link";

const CardMenuItem = ({ item }) => {
  return (
    <Link href={`/profile/menu-items/edit/${item.id}`}>
      <Card
        shadow="sm"
        isPressable
        className="hover:scale-90 transform transition-transform duration-[0.2s] ease-in-out"
      >
        <CardBody className="overflow-visible p-0">
          <Image
            shadow="sm"
            radius="lg"
            width="100%"
            alt={item.nombre}
            className="object-cover h-[140px] w-[200px]"
            src={item.imagen_url}
          />
        </CardBody>
        <CardFooter className="text-small justify-center">
          <b>{item.nombre}</b>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CardMenuItem;
