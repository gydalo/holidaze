import React from "react";

type ReusableButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
};

const ReusableButton: React.FC<ReusableButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-[#4B614F] text-white py-2 px-6 rounded-full hover:bg-[#3f5142] focus:outline-none focus:ring-2 focus:ring-[#4B614F] transition-all duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

export default ReusableButton;
