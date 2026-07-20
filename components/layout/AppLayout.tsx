"use client";

import { ReactNode } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-100">

      <div className="flex">

        <Sidebar />

        <div className="flex-1 min-h-screen">

          <Navbar />

          <main className="max-w-7xl mx-auto p-6">

            {children}

          </main>

        </div>

      </div>

    </div>
  );
}