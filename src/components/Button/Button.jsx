import React from 'react';
import './Button.css';

const Button = React.forwardRef(
    ({ className="", variant = 'primary', children, disabled, type = 'button', ...props }, ref) => {

        return (
        <button
            type={type}
            className={`button-base ${variant} ${className}`}
            ref={ref}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
