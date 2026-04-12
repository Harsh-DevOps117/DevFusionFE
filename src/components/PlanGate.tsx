"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface PlanGateProps {
  children: React.ReactNode;
  showOnlyFor?: "PRO" | "FREE" | "BOTH";
}

const PlanGate: React.FC<PlanGateProps> = ({
  children,
  showOnlyFor = "PRO",
}) => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const [mounted, setMounted] = useState(false);

  // 1. Prevent Hydration Mismatch (Next.js safety)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // 2. Auth Check
  if (!isAuthenticated || !user) return null;

  // 3. Logic Flip:
  // If we want BOTH, show it.
  if (showOnlyFor === "BOTH") return <>{children}</>;

  // If the user's plan DOES NOT match the required plan, hide it.
  if (user.plan !== showOnlyFor) {
    console.log(`Plan Mismatch: User is ${user.plan}, need ${showOnlyFor}`);
    return null;
  }

  // 4. Success: User is PRO (or whatever was requested)
  return <>{children}</>;
};

export default PlanGate;
