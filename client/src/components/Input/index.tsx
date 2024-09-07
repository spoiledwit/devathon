import React, { useState, useCallback, forwardRef, memo } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle, Check, LucideIcon } from "lucide-react";

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  success?: string;
}

const Input = memo(
  forwardRef<HTMLInputElement, ModernInputProps>(
    (
      {
        label,
        type = "text",
        placeholder,
        icon: Icon,
        value,
        onChange,
        onBlur,
        error,
        success,
        disabled = false,
        required = false,
        className = "",
        ...props
      },
      ref
    ) => {
      const [isFocused, setIsFocused] = useState(false);
      const [showPassword, setShowPassword] = useState(false);
      const handleFocus = useCallback(() => setIsFocused(true), []);
      const handleBlur = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
          setIsFocused(false);
          onBlur?.(e);
        },
        [onBlur]
      );

      const togglePasswordVisibility = useCallback(
        () => setShowPassword((prev) => !prev),
        []
      );

      const inputType = type === "password" && showPassword ? "text" : type;

      const inputClassName = `
        block w-full px-4 py-3 text-black bg-white
        rounded-lg border-2 border-gray-300
        ${error ? "border-red-500" : success ? "border-green-500" : ""}
        focus:outline-none focus:border-black
        hover:border-gray-400
        transition-all duration-200 ease-in-out
        ${Icon ? "pl-10" : ""}
        ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
        ${className}
      `;

      const labelClassName = `
        absolute left-3 px-1 bg-white
        transition-all duration-200 ease-in-out pointer-events-none
        ${
          isFocused || value
            ? "-top-2.5 text-xs text-black"
            : "top-1/2 -translate-y-1/2 text-base text-gray-500"
        }
      `;

      return (
        <div className="relative mb-4">
          <div className="relative">
            {Icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            )}
            <input
              ref={ref}
              type={inputType}
              className={inputClassName}
              placeholder={isFocused ? placeholder : ""}
              value={value}
              onChange={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled}
              required={required}
              {...props}
            />
            <label className={labelClassName}>
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            {type === "password" && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 flex items-center"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </motion.p>
          )}
          {success && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-green-600 flex items-center"
            >
              <Check className="h-4 w-4 mr-1" />
              {success}
            </motion.p>
          )}
        </div>
      );
    }
  )
);

Input.displayName = "Input";

export default Input;