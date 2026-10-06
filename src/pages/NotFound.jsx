import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
      <div className="text-center">
        <p className="text-7xl font-black text-winwin-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">The page you are looking for does not exist.</p>
        <Link to="/" className="btn-primary mt-6">
          Go Home
        </Link>
      </div>
    </div>
  );
}