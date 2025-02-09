"use client";

import { NewFile } from "@/components/newfile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAccount } from "@/context/accountContext";
import { ensureFileExtension } from "@/utils/ensureFileExtension";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { Trash, Edit as EditIcon } from "lucide-react";
import { useEffect, useState } from "react";

type File = {
  owner: string;
  fileName: string;
  registeredVersions: string[];
  createdAt: string;
  updatedAt: string;
};

export default function Files() {
  const { account } = useAccount();
  const [files, setFiles] = useState<File[]>([]);
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/me/files`, {
            credentials: "include",
          }
        );
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (!account.username) return;
    fetchFiles();
  }, [account.username]);

  async function deleteFile(fileName: string) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/files/${fileName}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    }
  }

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
          {files.length > 0 &&
            files.map((file) => (
              <TableRow
                key={file.fileName}
                className="hover:bg-gray-50 even:bg-gray-50 border-b border-gray-200 truncate max-w-[300px]"
              >
                <TableCell className="px-4 py-2 ">
                  <div
                    className="text-blue-800 font-semibold cursor-pointer whitespace-nowrap"
                    onClick={() => {
                      window.location.href = `/${file.fileName}/edit`;
                    }}
                  >
                    {ensureFileExtension(file.fileName)}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2 text-gray-800 whitespace-nowrap">
                  {formatRelativeTime(file.updatedAt)}
                </TableCell>
                <TableCell className="px-4 py-2 text-gray-800 text-center whitespace-nowrap">
                  <div className="flex gap-2 justify-end items-center">
                    <Button
                      className="flex items-center gap-1 px-3 py-1 text-xs"
                      onClick={() => {
                        window.location.href = `/${file.fileName}/edit`;
                      }}
                    >
                      Edit <EditIcon />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-red-500 hover:bg-red-600 rounded">
                          Delete <Trash />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete the file.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end">
                          <Button
                            className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-red-500 hover:bg-red-600 mr-2"
                            onClick={() => {
                              deleteFile(file.fileName);
                              setFiles(
                                files.filter(
                                  (f) => f.fileName !== file.fileName
                                )
                              );
                            }}
                          >
                            Delete <Trash />
                          </Button>
                          <DialogClose asChild>
                            <Button className="flex items-center gap-1 px-3 py-1 text-xs text-white mr-2">
                              Cancel
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <NewFile />
    </div>
  );
}
