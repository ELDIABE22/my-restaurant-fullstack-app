import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

const CardImageMenuItem = ({
  itemImage,
  setItemImage,
  params,
  savingItem,
  updateItem,
  deleteEvent,
}) => {
  const handleEditImage = async (file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (params) {
        const imageRemove = itemImage.image;
        setItemImage({ image: imageUrl, imageRemove, file });
      } else {
        setItemImage({ image: imageUrl, file });
      }
    }
  };

  return (
    <Card
      shadow="sm"
      isPressable
      isDisabled={savingItem || updateItem || deleteEvent}
    >
      <label className="w-full cursor-pointer">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleEditImage(e.target.files[0])}
        />
        <CardBody className="overflow-visible p-0">
          {itemImage?.image ? (
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={itemImage.image}
              className="object-cover h-[140px] w-[140px]"
              src={itemImage.image}
            />
          ) : (
            <div className="h-[140px] w-[140px] flex justify-center items-center border-b-1 bg-gray-300">
              Sin imagen
            </div>
          )}
        </CardBody>

        <CardFooter className="text-small justify-center">
          <b>{itemImage ? "Editar" : "Subir"}</b>
        </CardFooter>
      </label>
    </Card>
  );
};

export default CardImageMenuItem;
