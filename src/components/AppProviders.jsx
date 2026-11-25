"use client";

import { Toaster } from "react-hot-toast";

export default function AppProviders({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "14px",
            fontFamily: "var(--font-bangla), sans-serif",
          },
        }}
      />
    </>
  );
}
