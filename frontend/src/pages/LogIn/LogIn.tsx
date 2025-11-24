import { LoginCard } from "@/features/Auth/LogInCard";

export default function LoginPage() {
  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center items-center bg-zinc-900 text-white p-10">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to SSIS</h1>
          <p className="text-lg text-zinc-300">
            Manage your coleges, programs, and students.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center py-12 px-4 bg-white">
        <LoginCard />
      </div>
    </div>
  );
}
