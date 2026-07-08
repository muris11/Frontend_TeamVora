"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function GoogleLoginButton() {
  return (
    <Button 
      type="button" 
      variant="outline" 
      className="w-full flex items-center justify-center gap-2 mt-4 rounded-xl"
      onClick={() => signIn("google")}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.8 15.71 17.58V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
        <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.58C14.72 18.24 13.47 18.64 12 18.64C9.16 18.64 6.75 16.73 5.88 14.17H2.21V17.02C4.01 20.59 7.69 23 12 23Z" fill="#34A853"/>
        <path d="M5.88 14.17C5.66 13.51 5.54 12.77 5.54 12C5.54 11.23 5.66 10.49 5.88 9.83V6.98H2.21C1.47 8.46 1.05 10.18 1.05 12C1.05 13.82 1.47 15.54 2.21 17.02L5.88 14.17Z" fill="#FBBC05"/>
        <path d="M12 5.36C13.62 5.36 15.07 5.92 16.21 7.02L19.36 3.87C17.45 2.08 14.97 1 12 1C7.69 1 4.01 3.41 2.21 6.98L5.88 9.83C6.75 7.27 9.16 5.36 12 5.36Z" fill="#EA4335"/>
      </svg>
      Login dengan Google
    </Button>
  );
}
