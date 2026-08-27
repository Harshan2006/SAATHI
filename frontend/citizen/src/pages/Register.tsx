import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Landmark, User as UserIcon, Lock, Phone, Contact, Eye, EyeOff, Mail } from "lucide-react";
import { useAuth } from "../components/shared/Auth";
import { useToast } from "../components/shared/Toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      showToast("All fields are required.", "warning");
      return;
    }

    if (phone.trim().length < 10) {
      showToast("Please enter a valid 10-digit phone number.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email.trim(), name.trim(), phone.trim(), password.trim());
      showToast("Account created and logged in successfully!", "success");
      navigate("/citizen/dashboard");
    } catch (err: any) {
      showToast(err.message || "Registration failed.", "warning");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-alt px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-card border border-ink-100 bg-surface p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-teal-600 shadow-sm">
            <Landmark className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-ink-900">
            Create an account
          </h2>
          <p className="mt-1.5 text-center text-sm text-ink-500">
            Join the SAATHI Citizen Portal
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink-800">
              Full Name
            </label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-ink-400">
                <Contact className="h-4 w-4" />
              </span>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full rounded border border-ink-200 bg-surface py-2.5 pl-10 pr-3 text-sm placeholder:text-ink-400 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink-800">
              Email Address
            </label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-ink-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full rounded border border-ink-200 bg-surface py-2.5 pl-10 pr-3 text-sm placeholder:text-ink-400 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-ink-800">
              Phone Number
            </label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-ink-400">
                <Phone className="h-4 w-4" />
              </span>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit number"
                className="w-full rounded border border-ink-200 bg-surface py-2.5 pl-10 pr-3 text-sm placeholder:text-ink-400 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink-800">
              Password
            </label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-ink-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full rounded border border-ink-200 bg-surface py-2.5 pl-10 pr-10 text-sm placeholder:text-ink-400 focus:border-teal-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink-400 hover:text-ink-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full justify-center rounded bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="mt-6 border-t border-ink-100 pt-4 text-center">
          <p className="text-sm text-ink-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-teal-600 hover:text-teal-700 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
