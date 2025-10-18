"use client";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  variant?: "icon" | "typo" | "logo";
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({
  variant = "icon",
  className = "h-9 w-auto",
  width = 120,
  height = 36,
}: LogoProps) {
  const { theme } = useTheme();
  const [src, setSrc] = useState(siteConfig.logo.default);

  useEffect(() => {
    // setMounted(true);
    setSrc(
      variant === "icon"
        ? siteConfig.logo.default
        : variant === "logo"
        ? theme === "dark"
          ? siteConfig.logo.dark
          : siteConfig.logo.light
        : siteConfig.logo.typo
    );
  }, [theme, variant]);

  return (
    <Image
      src={src}
      alt={`${siteConfig.name} Logo`}
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
