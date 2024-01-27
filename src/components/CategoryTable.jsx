import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";
import { EditIcon } from "./icons/EditIcon";
import { DeleteIcon } from "./icons/DeleteIcon";
import axios from "axios";
import toast from "react-hot-toast";

const CategoryTable = ({
  categorys,
  setName,
  setEditedCategory,
  getCategory,
  loadingCategory,
}) => {
  const handleDelete = async (_id) => {
    const promise = new Promise(async (resolve, reject) => {
      const res = await axios.delete(`/api/category?_id=${_id}`);

      const { message } = res.data;

      if (message === "Categoría eliminada") {
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(promise, {
      loading: "Eliminando...",
      success: "Categoría eliminada",
      error: "Error al eliminar la categoría!",
    });

    getCategory();
  };

  if (loadingCategory)
    return <Spinner label="Cargando categorías..." color="warning" />;

  return (
    <Table
      aria-label="Example static collection table"
      className="max-w-[320px]"
    >
      <TableHeader>
        <TableColumn>NOMBRE</TableColumn>
        <TableColumn className="text-center">ACCIONES</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No hay categorías."}>
        {categorys?.length > 0 &&
          categorys.map((cat) => (
            <TableRow key={cat._id}>
              <TableCell>{cat.name}</TableCell>
              <TableCell className="flex justify-center">
                <div className="relative flex items-center gap-2">
                  <span
                    onClick={() => {
                      setEditedCategory(cat);
                      setName(cat.name);
                    }}
                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  >
                    <EditIcon />
                  </span>
                  <span
                    onClick={() => handleDelete(cat._id)}
                    className="text-lg text-danger cursor-pointer active:opacity-50"
                  >
                    <DeleteIcon />
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default CategoryTable;
