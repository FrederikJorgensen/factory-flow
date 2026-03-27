import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
};

export function Button({ children, className, ...props }: ButtonProps) {
    return (
        <button
            className={`cursor-pointer rounded-xl px-4 py-3 text-base font-semibold sm:px-6 sm:py-4 ${className ?? ""}`}
            {...props}
        >
            {children}
        </button>
    );
}
