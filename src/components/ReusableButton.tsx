import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}

const ReusableButton: React.FC<ButtonProps> = ({ onClick, type = 'button', children }) => {
  return (
    <button type={type} onClick={onClick}>
      {children}
    </button>
  );
};

export default ReusableButton;