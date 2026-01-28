"use client";

import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Signup1() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-white">Helix</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-brand-navy-dark border border-white/10 rounded-xl p-6">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-white">Create an account</h1>
            <p className="text-sm text-white/60 mt-1">
              Enter your email below to create your account
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full" variant="primary">
              Sign Up
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-brand-navy-dark px-2 text-white/40">Or continue with</span>
            </div>
          </div>

          {/* Google */}
          <Button variant="outline" className="w-full">
            <FcGoogle className="h-4 w-4" />
            Google
          </Button>

          {/* Terms */}
          <p className="text-center text-xs text-white/40 mt-6">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline hover:text-white/60">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-white/60">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-white/60 mt-6">
          Already have an account?{" "}
          <Link href="/auth" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
