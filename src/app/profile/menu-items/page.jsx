import CardMenuItem from "@/components/CardMenuItem";
import ArrowRightCircle from "@/components/icons/ArrowRightCircle";
import { Button, Link } from "@nextui-org/react";

const menuItems = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <Button
        className="w-2/4"
        color="warning"
        variant="ghost"
        radius="none"
        as={Link}
        href="/profile/menu-items/new"
      >
        Crear nuevo elemento de menú
        <ArrowRightCircle />
      </Button>

      <CardMenuItem />
    </div>
  );
};

export default menuItems;
