import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import Link from "next/link";

const CardMenuItem = ({ item }) => {
  return (
    <Link href={`/profile/menu-items/edit/${item._id}`}>
      <Card shadow="sm" isPressable>
        <CardBody className="overflow-visible p-0">
          <Image
            shadow="sm"
            radius="lg"
            width="100%"
            alt={item.name}
            className="object-cover h-[140px] w-[140px]"
            src={item.image.url}
          />
        </CardBody>
        <CardFooter className="text-small justify-center">
          <b>{item.name}</b>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CardMenuItem;
