"use client";

const HomePage = () => {
  return (
    <div className="flex h-screen w-full">
      <div className="bg-fondo-comida w-3/5"></div>
      <div className="bg-black w-2/5 ">
        <div className="h-screen flex flex-col justify-center items-center gap-6">
          <p className="text-green-500 p-2 text-lg font-medium shadow-green">
            ONLINE
          </p>
          <h1 className="flex p-2 font-bold text-4xl shadow-orange">
            <p className="text-white">DIABE</p>
            <p className="text-orange-peel">DELICIAS</p>
          </h1>
          <p className="text-white text-sm">
            Cada plato es una experiencia única, y cada visita es especial.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
