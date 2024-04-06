import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

const CardImageMenuItem = ({ itemImage, setItemImage, params }) => {
  async function handleEditImage(file) {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (params) {
        const imageId = itemImage.image.public_id;
        setItemImage({ image: { url: imageUrl, public_id: imageId }, file });
      } else {
        setItemImage({ image: { url: imageUrl }, file });
      }
    }
  }

  return (
    <Card shadow="sm" isPressable>
      <CardBody className="overflow-visible p-0">
        {itemImage?.image?.url ? (
          <Image
            shadow="sm"
            radius="lg"
            width="100%"
            alt={itemImage.image.url}
            className="object-cover h-[140px] w-[140px]"
            src={itemImage.image.url}
          />
        ) : (
          <div className="h-[140px] w-[140px] flex justify-center items-center border-b-1 bg-gray-300">
            Sin imagen
          </div>
        )}
      </CardBody>
      <label className="w-full cursor-pointer">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleEditImage(e.target.files[0])}
        />
        <CardFooter className="text-small justify-center">
          <b>{itemImage ? "Editar" : "Subir"}</b>
        </CardFooter>
      </label>
    </Card>
  );
};

export default CardImageMenuItem;
