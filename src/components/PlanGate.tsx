"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface PlanGateProps {
  children: React.ReactNode;
  showOnlyFor?: "PRO" | "FREE" | "BOTH";
  hideFor?: "PRO" | "FREE"; // ✅ Added this prop
}

const PlanGate: React.FC<PlanGateProps> = ({
  children,
  showOnlyFor,
  hideFor,
}) => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // 1. If not logged in, we usually want to show the Pricing/Razorpay
  // so they can actually buy it!
  if (!isAuthenticated || !user) {
    // If we are specifically hiding things for FREE users, return null
    if (showOnlyFor === "PRO") return null;
    return <>{children}</>;
  }

  // 2. Handle "hideFor" Logic (This is what you're using in your Features page)
  if (hideFor && user.plan === hideFor) {
    return null;
  }

  // 3. Handle "showOnlyFor" Logic
  if (showOnlyFor === "BOTH") return <>{children}</>;

  if (showOnlyFor && user.plan !== showOnlyFor) {
    return null;
  }

  return <>{children}</>;
};

export default PlanGate;
