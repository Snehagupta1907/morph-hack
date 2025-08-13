"use client";
import { Link as LinkScroll } from "react-scroll";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Button from "@/components/Resusables/Button";
const Header = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false); // Hydration check
  const pathname = usePathname();
  useEffect(() => {
    // Set hydration to true when the component is mounted
    setHydrated(true);

    const handleScroll = () => {
      setHasScrolled(window.scrollY > 32);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Avoid rendering until hydrated to prevent server-client mismatch
  if (!hydrated) return null;

  const NavLinkScroll = ({ title }: { title: string }) => (
    <LinkScroll
      onClick={() => setIsOpen(false)}
      to={title}
      offset={-100}
      spy
      smooth
      activeClass="nav-active"
      className="base-bold text-p4 uppercase transition-colors duration-500 cursor-pointer hover:text-p1 max-lg:my-4 max-lg:h5"
    >
      {title}
    </LinkScroll>
  );

  const NavLinkPage = ({ title, href }: { title: string; href: string }) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={clsx(
          "base-bold  uppercase transition-colors duration-500 cursor-pointer hover:text-p1 max-lg:my-4 max-lg:h5",
          isActive ? "text-p1" : "text-p4"
        )}
      >
        {title}
      </Link>
    );
  };

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 z-50 w-full py-10 transition-all duration-500 max-lg:py-4",
        hasScrolled && "py-2 bg-black-100 backdrop-blur-[8px]"
      )}
    >
      <div className="container flex h-14 items-center justify-between max-lg:px-5">
        <div className="flex items-center space-x-8">
          <div className="nav-logo">
            <Link href="/">
              <Image
                src="/images/buzz.svg"
                alt="Logo"
                className="h-10 w-auto"
                height={60}
                width={60}
              />
            </Link>
          </div>
        </div>
        <Button icon="/images/zap.svg">
          <Link href="/launch">Launch</Link>
        </Button>

        <button
          className="lg:hidden z-2 size-10 border-2 border-s4/25 rounded-full flex justify-center items-center"
          onClick={() => setIsOpen((prevState) => !prevState)}
        >
          <Image
            src={`/images/${isOpen ? "close" : "magic"}.svg`}
            alt="magic"
            className="size-1/2 object-contain w-auto"
            height={20}
            width={20}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={clsx(
          "w-full max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:bg-s2 max-lg:opacity-0",
          isOpen
            ? "max-lg:opacity-100 max-lg:pointer-events-auto"
            : "max-lg:pointer-events-none hidden"
        )}
      >
        <div className="max-lg:relative max-lg:flex max-lg:flex-col max-lg:min-h-screen max-lg:p-6 max-lg:overflow-hidden sidebar-before max-md:px-4">
          <div className="lg:hidden block absolute top-1/2 left-0 w-[960px] h-[380px] translate-x-[-290px] -translate-y-1/2 rotate-90">
            <Image
              src="/images/bg-outlines.svg"
              width={960}
              height={380}
              alt="outline"
              className="relative z-2"
            />
            <Image
              src="/images/bg-outlines-fill.png"
              width={960}
              height={380}
              alt="outline"
              className="absolute inset-0 mix-blend-soft-light opacity-5"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
