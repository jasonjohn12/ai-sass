"use client";
import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("13b89003-3b85-40b6-b5e6-8559fca8a565");
  }, []);
  return null;
};
