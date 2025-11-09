import React from "react";
import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={clsx(
        "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gray-100",
        className
      )}
      {...props}
    />
  );
}
