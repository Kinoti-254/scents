"use client";

import { useState } from "react";

export default function CopyButton({
  text,
  label = "Copy template"
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button type="button" className="btn-ghost" onClick={handleCopy}>
      {copied ? "Copied" : label}
    </button>
  );
}
