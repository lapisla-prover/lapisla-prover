import { FilePlus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

export function NewFile() {
  const router = useRouter();

  const formSchema = z.object({
    fileName: z
      .string()
      .regex(
        /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i,
        "Invalid file name format"
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/me/files/${values.fileName}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.status === 201) {
        router.push(`/${values.fileName}/edit`);
      } else {
        console.error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1 px-4 py-2 m-2">
          New File <FilePlus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New File</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="fileName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder="new file name" {...field} />
                  </FormControl>
                  <FormDescription>Enter the new file name.</FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit">Enter</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
