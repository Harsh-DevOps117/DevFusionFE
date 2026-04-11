"use client";
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface PlanGateProps {
  children: React.ReactNode;
  hideFor?: "PRO" | "FREE"; // Optional: flexibility to hide for anyone
}

/**
 * @description Gates content based on user plan.
 * Default behavior: Hides children if user is PRO.
 */
const PlanGate: React.FC<PlanGateProps> = ({ children, hideFor = "PRO" }) => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  // Phase 1: Check if user exists and plan matches the restriction
  const shouldHide = user?.plan === hideFor;

  // Phase 2: If hiding condition is met, return null (DOM will be empty)
  if (shouldHide) return null;

  // Phase 3: Otherwise, render the internal nodes
  return <>{children}</>;
};

export default PlanGate;
