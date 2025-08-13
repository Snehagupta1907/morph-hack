import React from "react";
import clsx from "clsx";
import { Marker } from "./Marker";
import Link from "next/link";

interface ButtonProps {
  icon?: string; // Optional icon URL
  children: React.ReactNode; // Button text or content
  href?: string; // Optional href for anchor tags
  containerClassName?: string; // Additional class names for container styling
  onClick?: () => void; // Optional click handler
  fill?: string; // Fill color for the Marker component
}

const Button: React.FC<ButtonProps> = ({
  icon,
  children,
  href,
  containerClassName,
  onClick,
  fill,
}) => {
  const Inner = () => (
    <>
      <span className="relative flex  p-2 g4 w-full items-center justify-center rounded-2xl inner-before group-hover:before:opacity-100 overflow-hidden">
        <span className="absolute -left-[1px]">
          {fill && <Marker fill={fill} />}
        </span>

        

        <span className="relative z-2 font-poppins base-bold text-p1 uppercase">
          {children}
        </span>
        {icon && (
          <img
            src={icon}
            alt="icon"
            className="size-5 ml-2 object-contain z-10" // Use 'mr-2' for smaller margin
          />
        )}
      </span>

      <span className="glow-before glow-after" />
    </>
  );

  return href ? (
    <Link
      className={clsx(
        "relative p-0.5 g5 rounded-2xl shadow-500 group",
        containerClassName
      )}
      href={href}
    >
      <Inner />
    </Link>
  ) : (
    <button
      className={clsx(
        "relative p-0.5 g5 rounded-2xl shadow-500 group",
        containerClassName
      )}
      onClick={onClick}
    >
      <Inner />
    </button>
  );
};

export default Button;
