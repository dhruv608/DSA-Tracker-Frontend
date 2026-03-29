"use client";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "../../../../app/(auth)/shared/components/Input";
import { Button } from "../../../../app/(auth)/shared/components/Button";
import { useUsernameCheck } from "../hooks/useUsernameCheck";
import { Loader, CheckCircle, XCircle, Type } from "lucide-react";

type UsernameStatus =
  | "idle"
  | "typing"
  | "available"
  | "taken"
  | "invalid";

export function OnboardingStep1({
  data,
  setData,
  setStep,
}: {
  data: any;
  setData: any;
  setStep: any;
}) {
  const [usernameStatus, setUsernameStatus] =
    useState<UsernameStatus>("idle");
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const { mutate: checkUsername, isPending } = useUsernameCheck();

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckedUsernameRef = useRef<string>("");

  // 🔥 API CALL (after debounce)
  useEffect(() => {
    if (
      debouncedUsername.length >= 3 &&
      debouncedUsername !== lastCheckedUsernameRef.current
    ) {
      lastCheckedUsernameRef.current = debouncedUsername;

      checkUsername(debouncedUsername.trim(), {
        onSuccess: (res) => {
          setUsernameStatus(res.available ? "available" : "taken");
        },
        onError: () => {
          setUsernameStatus("invalid");
        },
      });
    } else if (debouncedUsername.length < 3 && debouncedUsername.length > 0) {
      setUsernameStatus("invalid");
    } else if (debouncedUsername.length === 0) {
      setUsernameStatus("idle");
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [debouncedUsername, checkUsername]);

  // 🔥 INPUT HANDLER
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setData({ ...data, username: value });

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value.length > 0) {
      setUsernameStatus("typing");
    } else {
      setUsernameStatus("idle");
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedUsername(value);
      debounceTimerRef.current = null;
    }, 500);
  };

  const canProceed =
    usernameStatus === "available" && data.username?.trim().length >= 3;

  // 🔥 STATUS MESSAGE (UNIFIED SIZE)
  const getStatusMessage = () => {
    const base = "flex items-center gap-2 text-xs font-medium";

    switch (usernameStatus) {
      case "typing":
        return (
          <div className={`${base} text-muted-foreground`}>
            <Loader size={14} className="animate-spin" />
            <span>Typing...</span>
          </div>
        );

      case "available":
        return (
          <div className={`${base} text-green-500`}>
            <CheckCircle size={14} />
            <span>Username is available</span>
          </div>
        );

      case "taken":
        return (
          <div className={`${base} text-red-500`}>
            <XCircle size={14} />
            <span>Username already taken</span>
          </div>
        );

      case "invalid":
        return (
          <div className={`${base} text-red-500`}>
            <XCircle size={14} />
            <span>Minimum 3 characters required</span>
          </div>
        );

      default:
        return null;
    }
  };

  // 🔥 INPUT STYLES (PREMIUM LOOK)
  const getInputStyles = () => {
    const base =
      "h-12 rounded-xl bg-white/5 backdrop-blur-md border px-4 text-sm transition-all duration-300";

    switch (usernameStatus) {
      case "typing":
        return `${base} border-blue-400/30 ring-2 ring-blue-400/10`;

      case "available":
        return `${base} border-green-400/40 ring-2 ring-green-400/20 shadow-md shadow-green-500/10`;

      case "taken":
      case "invalid":
        return `${base} border-red-400/40 ring-2 ring-red-400/20 shadow-md shadow-red-500/10`;

      default:
        return `${base} border-white/10 focus:ring-2 focus:ring-primary/40`;
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="text-center mb-8 space-y-2">
        <h1 className="font-serif italic text-3xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent">
          Set Username
        </h1>

        <p className="text-sm text-muted-foreground">
          Choose a unique username for your profile
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canProceed) setStep(2);
        }}
        className="space-y-6"
      >
        {/* INPUT */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground">
            Username <span className="text-red-500">*</span>
          </label>

          <div className="relative group">
            <Input
              type="text"
              placeholder="e.g. ayush_dev"
              onChange={handleUsernameChange}
              required
              className={`${getInputStyles()} group-focus-within:shadow-lg`}
            />

            {/* RIGHT ICON */}
            {usernameStatus === "available" && (
              <CheckCircle
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
              />
            )}

            {(usernameStatus === "taken" ||
              usernameStatus === "invalid") && (
              <XCircle
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
              />
            )}

            {usernameStatus === "typing" && (
              <Loader
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-blue-400"
              />
            )}
          </div>

          {/* STATUS */}
          <div className="min-h-[20px] transition-all duration-300">
            <div key={usernameStatus} className="animate-fade-in">
              {getStatusMessage()}
            </div>
          </div>

         
          
        </div>

        {/* BUTTON */}
        <Button
          type="submit"
          disabled={!canProceed || isPending}
          className="w-full h-12 rounded-xl font-semibold bg-gradient-to-r from-primary to-amber-500 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50"
        >
          
            <span>Next →</span>
         
        </Button>
      </form>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.25s ease-out;
        }
      `}</style>
    </>
  );
}
