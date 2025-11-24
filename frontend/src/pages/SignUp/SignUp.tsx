import { SignUpCard } from "@/features/Auth/SignUpCard";

export default function SignupPage() {
  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center items-center bg-blue-700 text-white p-10">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4">Create an Account</h1>
          <p className="text-lg text-blue-100">
            Create an account to start managing your SSIS.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center py-12 px-4 bg-white">
        <SignUpCard />
      </div>
    </div>
  );
}
