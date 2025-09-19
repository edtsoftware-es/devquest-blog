"use client";

import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { Camera } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { UserWithRole } from "@/convex/lib/types";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { AuthorCard, AuthorCardImageContainer } from "./cards/author-card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function ProfileDialog({
  preloadedCurrentUser,
}: {
  preloadedCurrentUser: Preloaded<typeof api.users.getCurrentUser>;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const currentUser = usePreloadedQuery(preloadedCurrentUser);

  if (isDesktop) {
    return (
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>
          <Button>Editar Perfil</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>
              Realiza cambios en tu perfil aquí. Haz clic en guardar cuando
              hayas terminado. done.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm
            currentUser={currentUser}
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <Button>Editar Perfil</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Editar Perfil</DrawerTitle>
          <DrawerDescription>
            Realiza cambios en tu perfil aquí. Haz clic en guardar cuando hayas
            terminado.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm
          className="px-4"
          currentUser={currentUser}
          onSuccess={() => setOpen(false)}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({
  className,
  currentUser,
  onSuccess,
}: React.ComponentProps<"form"> & {
  currentUser: UserWithRole;
  onSuccess: () => void;
}) {
  const updateUserProfile = useMutation(api.users.updateUserProfile);
  const sendImage = useMutation(api.users.sendImage);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  return (
    <form
      className={cn("grid items-start gap-6", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        const postUrl = await generateUploadUrl();

        const result = await fetch(postUrl, {
          method: "POST",
          headers: {
            // biome-ignore lint/style/noNonNullAssertion: selectedImage is not null
            "Content-Type": selectedImage!.type,
          },
          body: selectedImage,
        });
        if (!result.ok) {
          throw new Error("Failed to upload image");
        }
        const { storageId } = await result.json();
        await sendImage({ storageId, userId: currentUser._id });
        await updateUserProfile({
          nickname: (e.target as HTMLFormElement).nickname.value,
          bio: (e.target as HTMLFormElement).bio.value,
          username: (e.target as HTMLFormElement).username.value,
        });
        setSelectedImage(null);
        // biome-ignore lint/style/noNonNullAssertion: imageInputRef is not null
        imageInputRef.current!.value = "";
        onSuccess();
      }}
    >
      <AuthorCard>
        <AuthorCardImageContainer>
          <div className="group relative cursor-pointer">
            <Avatar className="size-full">
              <AvatarImage
                decoding="sync"
                loading="eager"
                src={
                  selectedImage
                    ? URL.createObjectURL(selectedImage)
                    : currentUser.image
                }
              />
              <AvatarFallback>
                {currentUser.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <button
              aria-label="Cambiar foto de perfil"
              className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              onClick={() => imageInputRef.current?.click()}
              type="button"
            >
              <Camera className="h-6 w-6 text-white" />
            </button>

            <input
              accept="image/*"
              className="hidden"
              onChange={(event) =>
                setSelectedImage(event.target.files?.[0] ?? null)
              }
              ref={imageInputRef}
              type="file"
            />
          </div>
        </AuthorCardImageContainer>
      </AuthorCard>
      <div className="grid gap-3">
        <Label htmlFor="username">Nombre de usuario</Label>
        <Input defaultValue={currentUser.username} id="username" />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="nickname">Nickname</Label>
        <Input defaultValue={currentUser.nickname} id="nickname" />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          defaultValue={currentUser.bio}
          id="bio"
          placeholder="Breve descripción de ti..."
        />
      </div>

      <Button type="submit">Guardar</Button>
    </form>
  );
}
