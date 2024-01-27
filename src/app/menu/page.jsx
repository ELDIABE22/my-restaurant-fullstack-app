import CardMenu from "@/components/CardMenu";

const menu = () => {
  return (
    <div className="container mx-auto m-5 px-5">
      <div className="border-b-2 mb-4 pb-3">
        <h2 className="font-bold text-2xl text-center sm:text-start">
          Hamburguesas
        </h2>
      </div>
      <CardMenu />
    </div>
  );
};

export default menu;
