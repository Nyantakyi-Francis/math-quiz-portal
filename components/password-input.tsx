"use client";

import { useState } from "react";

type PasswordInputProps = {
  autoComplete: "current-password" | "new-password";
  minLength?: number;
};

export function PasswordInput({ autoComplete, minLength }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <input
        autoComplete={autoComplete}
        className="field password-input"
        id="password"
        minLength={minLength}
        name="password"
        required
        type={isVisible ? "text" : "password"}
      />
      <button
        aria-controls="password"
        aria-label={isVisible ? "Hide password" : "Show password"}
        className="focus-outline password-visibility-toggle absolute inset-y-0 right-0 flex min-w-16 items-center justify-center rounded-lg px-3 text-sm font-semibold"
        onClick={() => setIsVisible((visible) => !visible)}
        type="button"
      >
        {isVisible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
