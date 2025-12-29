"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function SigninWithPassword() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user starts typing
    if (error) setError(null);
    if (resendSuccess) setResendSuccess(false);
  };

  const handleResendConfirmation = async () => {
    if (!credentials.email) {
      setError("Please enter your email address first");
      return;
    }

    setResendLoading(true);
    setError(null);
    setResendSuccess(false);

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: credentials.email,
    });

    if (resendError) {
      setError(resendError.message);
    } else {
      setResendSuccess(true);
      setError(null);
    }
    setResendLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResendSuccess(false);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      // Check if the error is related to email confirmation
      const isEmailNotConfirmed = 
        error.message?.toLowerCase().includes("email not confirmed") ||
        error.message?.toLowerCase().includes("email_not_confirmed") ||
        error.status === 400 && error.message?.toLowerCase().includes("confirm");

      if (isEmailNotConfirmed) {
        setError("Email not confirmed. Please check your inbox for the confirmation email.");
      } else {
        setError(error.message ?? "An error occurred during sign in");
      }
      setLoading(false);
      return;
    }

    if (data.user) {
      router.push("/");
      router.refresh();
    } else {
      setError("Sign in failed. Please try again.");
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="email"
        label="Email"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your email"
        name="email"
        handleChange={handleChange}
        value={credentials.email}
        icon={<EmailIcon />}
      />

      <InputGroup
        type="password"
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Enter your password"
        name="password"
        handleChange={handleChange}
        value={credentials.password}
        icon={<PasswordIcon />}
      />

      {/* <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Remember me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
        />

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Forgot Password?
        </Link>
      </div> */}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          {(error.toLowerCase().includes("email not confirmed") || 
            error.toLowerCase().includes("email_not_confirmed")) && (
            <div className="mt-2">
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resendLoading}
                className="text-sm text-red-600 underline hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
              >
                {resendLoading ? "Sending..." : "Resend confirmation email"}
              </button>
            </div>
          )}
        </div>
      )}

      {resendSuccess && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
          <p className="text-sm text-green-600 dark:text-green-400">
            Confirmation email sent! Please check your inbox.
          </p>
        </div>
      )}

      <div className="mb-4.5">
        <button
          type="submit"
          className={`flex w-full items-center justify-center gap-2 rounded-lg p-4 font-medium text-white transition
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-primary hover:bg-opacity-90"
    }`}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
