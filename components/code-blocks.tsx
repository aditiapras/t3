// components/ShikiCodeBlock.tsx
"use client";

import { Check, Copy, Download, MoreHorizontal } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { codeToHtml } from "shiki";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
    children: string;
    language?: string;
    theme?: string;
    className?: string;
    filename?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
    children,
    language = "javascript",
    theme = "github-light",
    className,
    filename,
}) => {
    const [copied, setCopied] = useState(false);
    const codeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const highlightCode = async () => {
            if (!codeRef.current) return;

            try {
                const html = await codeToHtml(children, {
                    lang: language,
                    theme: theme,
                });
                codeRef.current.innerHTML = html;
            } catch (error) {
                console.error("Failed to highlight code:", error);
                codeRef.current.innerHTML = `<pre><code>${children}</code></pre>`;
            }
        };

        highlightCode();
    }, [children, language, theme]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const downloadCode = () => {
        const blob = new Blob([children], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename || `code.${language}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getLanguageLabel = (lang: string) => {
        const languageMap: Record<string, string> = {
            js: "JavaScript",
            jsx: "JSX",
            ts: "TypeScript",
            tsx: "TSX",
            py: "Python",
            bash: "Bash",
            css: "CSS",
            json: "JSON",
        };
        return languageMap[lang] || lang;
    };

    return (
        <div className="group relative rounded-lg border border-border overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b border-border">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                        {getLanguageLabel(language)}
                    </span>
                    {filename && (
                        <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{filename}</span>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyToClipboard}
                        className="h-8 w-8 p-0 hover:bg-muted"
                        title="Copy code"
                    >
                        {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={downloadCode}
                        className="h-8 w-8 p-0 hover:bg-muted"
                        title="Download code"
                    >
                        <Download className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-muted"
                        title="More options"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Code Content */}
            <div className="relative p-4">
                <div ref={codeRef} className={cn("shiki-container", className)} />
            </div>
        </div>
    );
};
