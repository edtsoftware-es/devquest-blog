"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function NewsletterCard() {
  return (
    <div className="relative flex w-full max-w-xl flex-col gap-8 rounded-lg bg-card px-8 py-14 lg:w-fit lg:max-w-none lg:px-80 lg:py-20">
      <svg
        className="absolute top-5 right-5 lg:top-8 lg:right-8"
        fill="none"
        height="23"
        viewBox="0 0 24 23"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Newsletter Icon</title>
        <path
          d="M0.5818 11.7288C8.79426 13.4715 10.2517 14.8616 12.1247 22.7374C13.8064 14.8771 15.2306 13.4995 23.4016 11.8281C15.1891 10.0854 13.7317 8.69528 11.8587 0.819485C10.1767 8.67981 8.75282 10.0574 0.5818 11.7288Z"
          fill="#F3F4F6"
        />
      </svg>

      <p className="text-center text-heading-4 text-neutral-900">
        Suscribete a nuestro newsletter
      </p>
      <div className="flex flex-col gap-2 lg:flex-row">
        <Input
          className="h-14 w-full rounded-full border border-neutral-500 px-5 lg:w-[362px]"
          placeholder="Escribe tu email"
        />
        <Button className="rounded-full" variant={"secondary"}>
          Suscribirse
        </Button>
      </div>
      <p className="text-center text-body-7 text-neutral-600">
        Solo recibirás noticias relevantes de la comunidad
      </p>
    </div>
  );
}
