import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../api/axios";
import { validateEmail } from "../utils/validators";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");

    const next = {
      email: validateEmail(email),
      password: password ? "" : "Password is required",
    };
    setErrors(next);
    if (next.email || next.password) return;

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate("/");
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const input = "w-full border rounded-lg px-3 py-2";
  const errText = "text-sm text-red-600 mt-1";

  return (
    <div className="min-h-screen flex items-center justify-center auth-bg px-44">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="auth-card w-full max-w-sm bg-white/95 backdrop-blur p-6 rounded-2xl shadow-xl space-y-4"
      >
        <h1 className="text-2xl font-bold">Log in</h1>
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
          {errors.email && <p className={errText}>{errors.email}</p>}
        </div>
        <div>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
          {errors.password && <p className={errText}>{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white rounded-lg py-2 disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
        <p className="text-sm text-gray-600">
          No account?{" "}
          <Link to="/signup" className="text-blue-600">Sign up</Link>
        </p>
      </form>
    </div>
  );
}