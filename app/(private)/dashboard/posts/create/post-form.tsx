"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { Category } from "@/types";

const TITLE_MAX_LENGTH = 200;
const SLUG_MAX_LENGTH = 100;
const EXCERPT_MAX_LENGTH = 500;

const postSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(TITLE_MAX_LENGTH, "El título no puede exceder 200 caracteres"),
  image: z.string().url("Debe ser una URL válida"),
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .max(SLUG_MAX_LENGTH, "El slug no puede exceder 100 caracteres"),
  categoryId: z.string().min(1, "La categoría es requerida"),
  content: z.string().min(1, "El contenido es requerido"),
  excerpt: z
    .string()
    .min(1, "El extracto es requerido")
    .max(EXCERPT_MAX_LENGTH, "El extracto no puede exceder 500 caracteres"),
  tags: z.string().min(1, "Las etiquetas son requeridas"),
  published: z.boolean(),
});

type PostFormData = z.infer<typeof postSchema>;

type PostFormProps = {
  categories: Category[];
  post?: any;
  mode?: "create" | "edit";
};

export function PostForm({ categories, post, mode = "create" }: PostFormProps) {
  const router = useRouter();

  const createPost = useMutation(api.posts.createPost);

  const updatePost = useMutation(api.posts.updatePost);

  const form = useForm<PostFormData>({
    // @ts-expect-error - Zod version compatibility issue
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      image: post?.image || "",
      slug: post?.slug || "",
      categoryId: post?.categoryId || "",
      content: post?.content || "",
      excerpt: post?.excerpt || "",
      tags: post?.tags?.join(", ") || "",
      published: post?.published,
    },
  });

  const onSubmit = (data: PostFormData) => {
    try {
      const tagsArray = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      if (mode === "edit" && post) {
        void updatePost({
          postId: post._id,
          title: data.title,
          image: data.image,
          slug: data.slug,
          categoryId: data.categoryId as Id<"categories">,
          content: data.content,
          excerpt: data.excerpt,
          tags: tagsArray,
          published: data.published,
        });
        toast.success("Post actualizado correctamente");
      } else {
        void createPost({
          title: data.title,
          image: data.image,
          slug: data.slug,
          categoryId: data.categoryId as Id<"categories">,
          content: data.content,
          excerpt: data.excerpt,
          tags: tagsArray,
          published: data.published,
        });
        toast.success("Post creado correctamente");
      }
      router.push("/dashboard");
    } catch {
      toast.error(
        `Error al ${mode === "edit" ? "actualizar" : "crear"} el post`
      );
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    form.setValue("title", title);
    const slug = generateSlug(title);
    form.setValue("slug", slug);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="font-medium text-2xl text-foreground">
          {mode === "edit" ? "Editar Post" : "Crear Nuevo Post"}
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          {mode === "edit"
            ? "Modifica los campos que desees cambiar"
            : "Completa todos los campos para crear un nuevo post"}
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Título del post"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleTitleChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="url-del-post" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de la imagen</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://ejemplo.com/imagen.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etiquetas</FormLabel>
                    <FormControl>
                      <Input placeholder="react, javascript, web" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extracto</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[100px]"
                      placeholder="Breve descripción del post..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenido</FormLabel>
                  <FormControl>
                    <MinimalTiptapEditor
                      autofocus={false}
                      className="w-full"
                      editable={true}
                      editorClassName="focus:outline-hidden"
                      editorContentClassName="p-4 min-h-[300px]"
                      onChange={field.onChange}
                      output="html"
                      placeholder="Escribe el contenido de tu post aquí..."
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-card p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Publicar</FormLabel>
                    <div className="text-muted-foreground text-sm">
                      Marca esta casilla para publicar el post inmediatamente
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                disabled={form.formState.isSubmitting}
                onClick={() => router.back()}
                type="button"
                variant="outline"
              >
                Cancelar
              </Button>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting
                  ? mode === "edit"
                    ? "Actualizando..."
                    : "Creando..."
                  : mode === "edit"
                    ? "Actualizar Post"
                    : "Crear Post"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
