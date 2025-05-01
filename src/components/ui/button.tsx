import React, { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  className = "",
  size = "md",
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: "text-sm px-3 py-1",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  };

  return (
    <button
      className={`${sizeClasses[size]} rounded-xl bg-gray-500 text-white hover:bg-gray-700 transition font-semibold ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
