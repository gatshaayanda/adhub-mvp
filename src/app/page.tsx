"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const keys = useRef<string[]>([]);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Keyboard “admin” detector
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      keys.current.push(e.key.toLowerCase());
      if (keys.current.length > 5) keys.current.shift();
      if (keys.current.join("").includes("admin")) {
        router.push("/login");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  // Long-press helper for mobile
  const longPress = {
    onTouchStart: () => setTouchStart(Date.now()),
    onTouchEnd: () => {
      if (touchStart && Date.now() - touchStart > 600) {
        router.push("/login");
      }
      setTouchStart(null);
    },
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#0B1A33]">
      {/* NAV */}
      <header className="w-full px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 select-none"
          {...longPress}
        >
          <Image
            src="/logo-mark.svg"
            alt="AdminHub"
            width={32}
            height={32}
            priority
          />
          <span className="font-bold tracking-tight text-lg">AdminHub</span>
        </Link>
        <nav className="hidden sm:flex gap-6 font-medium">
          <Link href="#services" className="hover:text-[#C5A100]">
            Services
          </Link>
          <Link href="#about" className="hover:text-[#C5A100]">
            About
          </Link>
          <Link href="#contact" className="hover:text-[#C5A100]">
            Contact
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight max-w-3xl">
          We’ve got you,
          <br className="hidden sm:block" />
          No hype, no noise.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-[#4F5F7A]">
          Just smart, smooth digital execution you can trust.
        </p>
        <Link
          href="#contact"
          className="mt-8 inline-block bg-[#C5A100] text-white rounded-full px-7 py-3 font-semibold hover:opacity-90 transition"
        >
          Get Started
        </Link>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 grid gap-10 text-center md:grid-cols-3">
          {[
            {
              title: "Design & Build",
              body: "Modern, performant sites & PWAs built with Next.js.",
            },
            {
              title: "Care Plans",
              body: "Security, updates & content tweaks – month after month.",
            },
            {
              title: "Scale & Evolve",
              body: "Add features or redesign when your business grows.",
            },
          ].map(({ title, body }) => (
            <div key={title}>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-sm text-[#4F5F7A]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-16 bg-[#F1F1F1]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-2xl font-bold">Your Digital Partner</h2>
          <p className="text-[#4F5F7A] leading-relaxed">
            Based in Botswana, AdminHub plugs straight into your workflow –
            guiding you from idea to live launch. Whether you need a brand-new
            site, a progressive web app, or ongoing maintenance, we keep things
            simple and results-driven.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to chat?</h2>
          <p className="text-[#4F5F7A] mb-8">
            Drop your details and we’ll send a quick questionnaire to kick-off.
          </p>
          <a
            href="mailto:hello@adminhub.co.bw"
            className="inline-block bg-[#0B1A33] text-white rounded-full px-7 py-3 font-semibold hover:opacity-90 transition"
          >
            Email Us
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-xs text-[#4F5F7A]">
        © {new Date().getFullYear()} AdminHub • From idea → launch
        <Link href="/login" className="sr-only">
          Admin Login
        </Link>
      </footer>
    </main>
  );
}
