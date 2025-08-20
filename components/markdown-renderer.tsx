// components/MarkdownRenderer.tsx
"use client";

import React from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./code-blocks";
import "katex/dist/katex.min.css";

interface MarkdownRendererProps {
    children: string;
    className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
    children,
    className,
}) => {
    const components: Components = {
        // Headings
        h1: ({ children, ...props }) => (
            <h1
                className="text-4xl font-bold tracking-tight text-foreground mb-6 mt-8 first:mt-0"
                {...props}
            >
                {children}
            </h1>
        ),
        h2: ({ children, ...props }) => (
            <h2
                className="text-3xl font-semibold tracking-tight text-foreground border-b border-border pb-2 mb-4 mt-8 first:mt-0"
                {...props}
            >
                {children}
            </h2>
        ),
        h3: ({ children, ...props }) => (
            <h3
                className="text-2xl font-semibold tracking-tight text-foreground mb-4 mt-6"
                {...props}
            >
                {children}
            </h3>
        ),
        h4: ({ children, ...props }) => (
            <h4
                className="text-xl font-semibold tracking-tight text-foreground mb-3 mt-6"
                {...props}
            >
                {children}
            </h4>
        ),
        h5: ({ children, ...props }) => (
            <h5
                className="text-lg font-semibold tracking-tight text-foreground mb-3 mt-4"
                {...props}
            >
                {children}
            </h5>
        ),
        h6: ({ children, ...props }) => (
            <h6
                className="text-base font-semibold tracking-tight text-foreground mb-3 mt-4"
                {...props}
            >
                {children}
            </h6>
        ),

        // Paragraphs
        p: ({ children, ...props }) => (
            <p className="text-foreground leading-7 mb-4 last:mb-0" {...props}>
                {children}
            </p>
        ),

        // Lists - menggunakan Tailwind classes yang proper
        ul: ({ children, ...props }) => (
            <ul
                className="list-disc list-outside ml-6 mb-4 space-y-1 text-foreground marker:text-foreground"
                {...props}
            >
                {children}
            </ul>
        ),
        ol: ({ children, ...props }) => (
            <ol
                className="list-decimal list-outside ml-6 mb-4 space-y-1 text-foreground marker:text-foreground"
                {...props}
            >
                {children}
            </ol>
        ),
        li: ({ children, ...props }) => {
            // Type-safe check for task list items
            const childrenArray = React.Children.toArray(children);
            const hasCheckbox = childrenArray.some(child => {
                if (React.isValidElement(child)) {
                    const element = child as React.ReactElement<any>;
                    return element.type === 'input' && element.props?.type === 'checkbox';
                }
                return false;
            });

            if (hasCheckbox) {
                return (
                    <li
                        className="list-none -ml-6 text-foreground leading-7 flex items-start"
                        {...props}
                    >
                        {children}
                    </li>
                );
            }

            return (
                <li className="text-foreground leading-7" {...props}>
                    {children}
                </li>
            );
        },

        // Code
        code: ({ children, className, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            const isCodeBlock = Boolean(match && className?.includes("language-"));

            if (isCodeBlock && language) {
                return (
                    <CodeBlock language={language}>
                        {String(children).replace(/\n$/, "")}
                    </CodeBlock>
                );
            }

            return (
                <code
                    className="relative rounded bg-muted px-2 py-1 font-mono text-sm font-medium text-foreground border"
                    {...props}
                >
                    {children}
                </code>
            );
        },

        // Pre
        pre: ({ children, ...props }) => (
            <pre
                {...props}
            >
                <code className="font-sans text-foreground">{children}</code>
            </pre>
        ),

        // Tables
        table: ({ children, ...props }) => (
            <div className="my-6 w-full overflow-x-auto">
                <table
                    className="w-full border-collapse border border-border"
                    {...props}
                >
                    {children}
                </table>
            </div>
        ),
        thead: ({ children, ...props }) => (
            <thead className="bg-muted/50" {...props}>
                {children}
            </thead>
        ),
        tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
        tr: ({ children, ...props }) => (
            <tr className="border-b border-border hover:bg-muted/30" {...props}>
                {children}
            </tr>
        ),
        th: ({ children, ...props }) => (
            <th
                className="border border-border bg-muted px-4 py-3 text-left font-semibold text-foreground"
                {...props}
            >
                {children}
            </th>
        ),
        td: ({ children, ...props }) => (
            <td
                className="border border-border px-4 py-3 text-left text-foreground"
                {...props}
            >
                {children}
            </td>
        ),

        // Blockquote
        blockquote: ({ children, ...props }) => (
            <blockquote
                className="border-l-4 border-primary pl-6 py-2 my-4 italic text-muted-foreground bg-muted/30 rounded-r"
                {...props}
            >
                {children}
            </blockquote>
        ),

        // Horizontal Rule
        hr: ({ ...props }) => <hr className="my-8 border-border" {...props} />,

        // Links
        a: ({ children, href, ...props }) => (
            <a
                href={href}
                className="text-primary underline underline-offset-4 hover:text-primary/80 font-medium"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                {...props}
            >
                {children}
            </a>
        ),

        // Strong/Bold
        strong: ({ children, ...props }) => (
            <strong className="font-bold text-foreground" {...props}>
                {children}
            </strong>
        ),

        // Emphasis/Italic
        em: ({ children, ...props }) => (
            <em className="italic text-foreground" {...props}>
                {children}
            </em>
        ),



        // Delete/Strikethrough
        del: ({ children, ...props }) => (
            <del className="line-through text-muted-foreground" {...props}>
                {children}
            </del>
        ),

        // Task list checkboxes
        input: ({ type, checked, ...props }) => {
            if (type === "checkbox") {
                return (
                    <input
                        type="checkbox"
                        checked={checked}
                        disabled
                        className="mr-2 accent-primary"
                        {...props}
                    />
                );
            }
            return <input type={type} {...props} />;
        },
    };

    return (
        <div className={cn("w-full max-w-none", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                components={components}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
};
