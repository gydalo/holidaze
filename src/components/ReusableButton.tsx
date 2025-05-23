import React from "react";

type ReusableButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
};

const ReusableButton: React.FC<ReusableButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
  variant = "primary",
}) => {
  const base =
    "py-2 px-6 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2";

  const variants = {
    primary:
      "bg-[#4B614F] text-white border border-transparent hover:bg-white hover:text-[#4B614F] hover:border-[#4B614F] focus:ring-[#4B614F]",
    secondary:
      "bg-transparent text-[#4B614F] border border-[#4B614F] hover:bg-[#4B614F] hover:text-white transition focus:ring-[#4B614F]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default ReusableButton;
