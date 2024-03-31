"use client";

const HomePage = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      <div className="bg-fondo-comida w-full md:w-3/5"></div>
      <div className="h-screen flex items-center bg-fondo-comida md:bg-none md:bg-black w-full md:w-2/5 md:p-3">
        <div className="w-full bg-black rounded flex flex-col justify-center items-center gap-6 px-5 py-7 md:p-0">
          <p className="text-green-500 p-2 text-lg font-medium shadow-green">
            ONLINE
          </p>
          <h1 className="flex p-2 font-bold text-4xl shadow-orange">
            <p className="text-white">DIABE</p>
            <p className="text-orange-peel">DELICIAS</p>
          </h1>
          <p className="text-white font-medium text-sm text-center">
            Cada plato es una experiencia única, y cada visita es especial.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
