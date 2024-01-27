import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

const CardMenuItem = () => {
  return (
    <div>
      <Card shadow="sm" isPressable>
        <CardBody className="overflow-visible p-0">
          <Image
            shadow="sm"
            radius="lg"
            width="100%"
            alt="Pizza"
            className="object-cover h-[140px] w-[140px]"
            src="/pizza.jpg"
          />
        </CardBody>
        <CardFooter className="text-small justify-center">
          <b>Pizza</b>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CardMenuItem;
