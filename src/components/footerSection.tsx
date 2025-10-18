"use client"

import { Github } from "lucide-react"
import { siteConfig } from "@/config/site"
import Link from "next/link"
import { Logo } from "./logo"

export function FooterSection() {
  return (
    <footer className="w-full max-w-[1320px] mx-auto px-5 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0 py-10 md:py-[70px]">
      {/* Left Section: Logo, Description, Social Links */}
      <div className="flex flex-col justify-start items-start gap-8 p-4 md:p-8">
        <Link href="/" className="group">
          <Logo variant="typo" className="h-8 w-auto transition-transform group-hover:scale-105" width={100} height={32} />
        </Link>
        <p className="text-foreground/90 text-sm font-medium leading-[18px] text-left max-w-xs">{siteConfig.description}</p>
        <div className="flex justify-start items-start gap-3">
          <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-4 h-4 flex items-center justify-center hover:text-foreground transition-colors">
            <Github className="w-full h-full text-muted-foreground" />
          </a>
        </div>
      </div>
      {/* Right Section: Product, Company, Resources */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 p-4 md:p-8 w-full md:w-auto">
        <div className="flex flex-col justify-start items-start gap-3">
          <h3 className="text-muted-foreground text-sm font-medium leading-5">Product</h3>
          <div className="flex flex-col justify-end items-start gap-2">
            {siteConfig.footerLinks.product.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-foreground text-sm font-normal leading-5 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-3">
          <h3 className="text-muted-foreground text-sm font-medium leading-5">Community</h3>
          <div className="flex flex-col justify-center items-start gap-2">
            {siteConfig.footerLinks.community.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-foreground text-sm font-normal leading-5 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-3">
          <h3 className="text-muted-foreground text-sm font-medium leading-5">Resources</h3>
          <div className="flex flex-col justify-center items-start gap-2">
            {siteConfig.footerLinks.resources.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-foreground text-sm font-normal leading-5 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
