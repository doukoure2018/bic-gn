"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"

const navLinks = [
  { label: "Accueil", href: "#", active: true },
  { label: "A Propos", href: "#" },
  { label: "Industrie", href: "#" },
  { label: "Commerce", href: "#" },
  { label: "Donnees", href: "#" },
  { label: "Publications", href: "#" },
  { label: "Actualites", href: "#" },
  { label: "Partenaires", href: "#" },
  { label: "Contact", href: "#" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-[#0A1F44] text-[#F5F5F0] sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="#" className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              <div className="h-4 w-1.5 rounded-sm bg-[#D4A829]" />
              <div className="h-4 w-1.5 rounded-sm bg-[#C41E3A]" />
              <div className="h-4 w-1.5 rounded-sm bg-[#2E8B57]" />
            </div>
            <span className="text-lg font-bold tracking-wider font-mono">ONCP</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`rounded px-3 py-1.5 text-sm transition-colors hover:bg-[#D4A829]/20 ${
                link.active
                  ? "border-b-2 border-[#D4A829] text-[#D4A829] font-semibold"
                  : "text-[#F5F5F0]/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="rounded p-2 text-[#F5F5F0] lg:hidden hover:bg-[#D4A829]/20"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-[#F5F5F0]/10 px-4 pb-4 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`block rounded px-3 py-2 text-sm transition-colors hover:bg-[#D4A829]/20 ${
                link.active ? "text-[#D4A829] font-semibold" : "text-[#F5F5F0]/80"
              }`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
