"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqData = [
  {
    question: "What is Aiken MCP Server and who is it for?",
    answer:
      "Aiken MCP Server is a Model Context Protocol server that provides AI assistants with access to Aiken's documentation and standard library. It's designed for developers building Cardano smart contracts with Aiken who want to leverage AI assistance in their workflow.",
  },
  {
    question: "What tools does the MCP server provide?",
    answer:
      "The server provides three main tools: languageTour for accessing Aiken syntax and documentation metadata, stdlib for querying standard library functions and types, and stdlib-module for fetching complete source code of specific Aiken stdlib modules.",
  },
  {
    question: "How do I connect my AI assistant to the server?",
    answer:
      "You can connect via multiple methods: direct HTTP/SSE for remote deployments, using the mcp-remote package for stdio-only clients, or through Claude Desktop configuration. Each method requires adding the server URL to your MCP client configuration.",
  },
  {
    question: "Is the server free to use?",
    answer:
      "Yes! The Aiken MCP Server is open source and free to use. You can deploy it yourself or use our hosted version. The free tier includes access to all Aiken documentation and standard library features.",
  },
  {
    question: "Can I run the server locally?",
    answer:
      "Absolutely. You can clone the repository, install dependencies with npm, and run the development server locally on port 3000. This is perfect for development and testing before deploying to production.",
  },
  {
    question: "What AI assistants are compatible?",
    answer:
      "Any AI assistant that supports the Model Context Protocol (MCP) can connect to this server. This includes Claude Desktop, and other MCP-compatible tools. The server works with both HTTP/SSE and stdio transport methods.",
  },
]

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onToggle()
  }
  return (
    <div
      className={`w-full bg-[rgba(231,236,235,0.08)] shadow-[0px_2px_4px_rgba(0,0,0,0.16)] overflow-hidden rounded-[10px] outline-1 outline-border outline-offset-[-1px] transition-all duration-500 ease-out cursor-pointer`}
      onClick={handleClick}
    >
      <div className="w-full px-5 py-[18px] pr-4 flex justify-between items-center gap-5 text-left transition-all duration-300 ease-out">
        <div className="flex-1 text-foreground text-base font-medium leading-6 break-words">{question}</div>
        <div className="flex justify-center items-center">
          <ChevronDown
            className={`w-6 h-6 text-muted-foreground-dark transition-all duration-500 ease-out ${isOpen ? "rotate-180 scale-110" : "rotate-0 scale-100"}`}
          />
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
        style={{
          transitionProperty: "max-height, opacity, padding",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          className={`px-5 transition-all duration-500 ease-out ${isOpen ? "pb-[18px] pt-2 translate-y-0" : "pb-0 pt-0 -translate-y-2"}`}
        >
          <div className="text-foreground/80 text-sm font-normal leading-6 break-words">{answer}</div>
        </div>
      </div>
    </div>
  )
}

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())
  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }
  return (
    <section className="w-full pt-[66px] pb-20 md:pb-40 px-5 relative flex flex-col justify-center items-center">
      <div className="w-[300px] h-[500px] absolute top-[150px] left-1/2 -translate-x-1/2 origin-top-left rotate-[-33.39deg] bg-primary/10 blur-[100px] z-0" />
      <div className="self-stretch pt-8 pb-8 md:pt-14 md:pb-14 flex flex-col justify-center items-center gap-2 relative z-10">
        <div className="flex flex-col justify-start items-center gap-4">
          <h2 className="w-full text-center text-foreground text-4xl font-semibold leading-10 break-words">
            Frequently Asked Questions
          </h2>
          <p className="self-stretch text-center text-muted-foreground text-sm font-medium leading-[18.20px] break-words">
            Everything you need to know about Aiken MCP Server and how it enhances your Aiken development workflow
          </p>
        </div>
      </div>
      <div className="w-full max-w-[600px] pt-0.5 pb-10 flex flex-col justify-start items-start gap-4 relative z-10">
        {faqData.map((faq, index) => (
          <FAQItem key={index} {...faq} isOpen={openItems.has(index)} onToggle={() => toggleItem(index)} />
        ))}
      </div>
    </section>
  )
}
