import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash, Edit as EditIcon, FilePlus } from "lucide-react";

export default function Edit() {
  const files = [
    {
      name: "bubblesort.l",
      lastUpdated: "2 minutes ago",
      id: "1",
    },
    {
      name: "quicksort.l",
      lastUpdated: "3 minutes ago",
      id: "2",
    },
    {
      name: "mergesort.l",
      lastUpdated: "4 minutes ago",
      id: "3",
    },
  ];
  return (
    <div className="p-8 gap-8">
      <div className="w-[60%] p-4 space-y-4">
        <div className="flex justify-between items-end">
          <div className="text-2xl font-bold">All files</div>
        </div>
        <div className="h-0.5 w-full bg-black" />
      </div>
      <Table className="p-4 table-auto border-collapse border border-gray-300 w-full text-sm text-left">
        <TableHeader className="bg-gray-100 border-b border-gray-300">
          <TableRow>
            <TableHead className="w-[200px] px-4 py-2 font-semibold text-gray-700">
              File Name
            </TableHead>
            <TableHead className="px-4 py-2 font-semibold text-gray-700 w-1/6">
              Last Edited
            </TableHead>
            <TableHead className="px-4 py-2 font-semibold text-gray-700 text-right w-1/6">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow
              key={file.name}
              className="hover:bg-gray-50 even:bg-gray-50 border-b border-gray-200 truncate max-w-[300px]"
            >
              <TableCell className="px-4 py-2 text-blue-800 font-semibold">
                {file.name}
              </TableCell>
              <TableCell className="px-4 py-2 text-gray-800 whitespace-nowrap">
                {file.lastUpdated}
              </TableCell>
              <TableCell className="px-4 py-2 text-gray-800 text-center whitespace-nowrap">
                <div className="flex gap-2 justify-end items-center">
                  <Button className="flex items-center gap-1 px-3 py-1 text-xs text-white">
                    Edit <EditIcon />
                  </Button>
                  <Button className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-red-500 hover:bg-red-600 rounded">
                    Delete <Trash />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button className="flex items-center gap-1 px-4 py-2 m-2">
        New File <FilePlus />
      </Button>
    </div>
  );
}
