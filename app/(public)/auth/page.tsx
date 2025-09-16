import { SignInOptions } from "./components/signin-options";

export default function AuthPage() {
  return (
    <main className="mt-32 flex w-full justify-center">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-heading-3">Bienvenido!</h1>
          <p className="text-neutral-500">
            Crea una cuenta hoy y empieza a usar nuestra plataforma
          </p>
        </div>
        <SignInOptions />
      </div>
    </main>
  );
}
