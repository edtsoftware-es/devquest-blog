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
  
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";

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
};

export function PostForm({ categories }: PostFormProps) {
  const router = useRouter();

const createPost = useMutation(api.posts.createPost).withOptimisticUpdate(
  (localStore, args) => {
    const existingPosts = localStore.getQuery(api.posts.getPostsByUserRole, {});
    if (existingPosts !== undefined) {
      const now = Date.now();
      const duration = Math.ceil(args.content.split(/\s+/).length / 200);
      const tempPost = {
        _id: `temp_${now}` as Id<"posts">,
        _creationTime: now,
        title: args.title,
        image: args.image,
        duration,
        slug: args.slug,
        categoryId: args.categoryId,
        content: args.content,
        excerpt: args.excerpt,
        authorId: "temp-author" as Id<"users">,
        tags: args.tags,
        likesCount: 0,
        commentsCount: 0,
        published: args.published,
        updatedAt: now,
        publishedAt: args.published ? now : undefined,
        deletedAt: undefined,
        viewCount: 0,
      };
      localStore.setQuery(api.posts.getPostsByUserRole, {}, [
        tempPost,
        ...existingPosts,
      ]);
    }
  }
);
  const form = useForm<PostFormData>({
    // @ts-expect-error - Zod version compatibility issue
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      image: "",
      slug: "",
      categoryId: "",
      content: "",
      excerpt: "",
      tags: "",
      published: false,
    },
  });

  const onSubmit = async (data: PostFormData) => {
    try {

      const tagsArray = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await createPost({
        title: data.title,
        image: data.image,
        slug: data.slug,
        categoryId: data.categoryId as Id<"categories">,
        content: data.content,
        excerpt: data.excerpt,
        tags: tagsArray,
        published: data.published,
      });

      toast.success("Post creado exitosamente");

      router.push("/dashboard");
    } catch {
      toast.error("Error al crear el post");
    }   };

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
        <h1 className="font-bold text-3xl text-gray-900 dark:text-white">
          Crear Nuevo Post
        </h1>
        <p className="mt-2 text-gray-600 text-sm dark:text-gray-400">
          Completa todos los campos para crear un nuevo post
        </p>
      </div>

      <Form {...form}>
        <form
          className="space-y-6 sm:space-y-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
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
                <FormLabel className="font-medium text-base">
                  Contenido
                </FormLabel>
                <FormControl>
                  <div className="rounded-lg border">
                    <MinimalTiptapEditor
             autofocus={false} onChange={field.onChange} value={field.value}
             className="w-full"
             editable={true}
                 editorClassName="focus:outline-hidden"
                 editorContentClassName="p-4 sm:p-6 min-h-[300px] sm:min-h-[400px]"
                   output="html"
                placeholder="Escribe el contenido de tu post aquí..."
      
    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-lg border">
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="font-medium text-base">
                      Publicar
                    </FormLabel>
                    <div className="text-gray-600 text-sm dark:text-gray-400">
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
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            <Button
              className="w-full sm:w-auto"
              disabled={form.formState.isSubmitting}
              onClick={() => router.back()}
              type="button"
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              className="w-full sm:w-auto"
              disabled={form.formState.isSubmitting}
              type="submit"
            >
              {form.formState.isSubmitting ? "Creando..." : "Crear Post"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
