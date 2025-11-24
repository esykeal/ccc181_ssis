import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "@/lib/api";
import { useAuthContext } from "@/features/Auth/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LoginCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginCard({ className, ...props }: LoginCardProps) {
  const navigate = useNavigate();
  const { fetchCredentials } = useAuthContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("1. Starting login process...");

      console.log("2. Logging out any existing session...");
      try {
        await api.post("/auth/logout");
      } catch (logoutErr) {
        console.log("Logout not needed or failed:", logoutErr);
      }

      console.log("3. Sending login request...");
      const response = await api.post("/auth/login", { username, password });
      console.log("Login response:", response.data);

      console.log("Cookies available:", document.cookie);

      await new Promise((resolve) => setTimeout(resolve, 100));

      console.log("4. Testing session with /auth/me...");
      const meResponse = await api.get("/auth/me");
      console.log("Immediate /auth/me check:", meResponse.data);

      console.log("5. Updating React context...");
      await fetchCredentials();

      console.log("6. Login successful, redirecting...");
      toast.success("Login successful");
      navigate("/");
    } catch (err: any) {
      console.error("Login error details:", err);
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        console.error("Error response headers:", err.response.headers);
      }
      setError(err.response?.data?.error || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={cn("w-full max-w-sm", className)} {...props}>
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your account details to login</CardDescription>
      </CardHeader>

      <form onSubmit={handleLogin}>
        <CardContent>
          <div className="grid gap-4">
            {error && (
              <div className="text-sm text-red-500 font-medium">{error}</div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 mt-8">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="mt-2 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline hover:text-primary">
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
