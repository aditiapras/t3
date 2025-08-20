import { Response } from "@/components/ai-elements/response";

// import { MarkdownRenderer } from "@/components/markdown-renderer";

const markdownContent = `
# Heading 1 - Main Title

## Heading 2 - Section Title

### Heading 3 - Subsection

#### Heading 4 - Sub-subsection

##### Heading 5 - Minor heading

###### Heading 6 - Smallest heading

## Typography Examples

This is a **bold text** and this is *italic text*. You can also have ~~strikethrough text~~.

Here's a paragraph with some inline code: \`const greeting = "Hello World";\`

## Lists

### Unordered List (Bullets)
- First item
- Second item
  - Nested item 1
  - Nested item 2
    - Deep nested item
- Third item

### Ordered List (Numbers)
1. First numbered item
2. Second numbered item
   1. Nested numbered item
   2. Another nested item
3. Third numbered item

### Task List
- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task

## Code Examples

### JavaScript
\`\`\`javascript
const calculateCircleArea = (radius) => {
  return Math.PI * radius * radius;
};

console.log(calculateCircleArea(5));
\`\`\`

### TypeScript
\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const createUser = (userData: Omit<User, 'id'>): User => {
  return {
    id: Math.random(),
    ...userData
  };
};
\`\`\`

## Math Equations

### Inline Math
The famous equation is ( Delta U = Q - W ) discovered by Einstein.

### Display Math
$$
L = \\pi r^2
$$

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

## Tables

| Name | Age | Profession | Location |
|------|-----|------------|----------|
| Aditia | 25 | Full Stack Developer | Indonesia |
| Aning | 24 | Designer | Indonesia |
| John | 30 | Product Manager | USA |

## Links and Images

Visit [OpenAI](https://openai.com) for more information.

![Sample Image](https://via.placeholder.com/400x200?text=Sample+Image)

## Blockquotes

> This is a blockquote. It can contain multiple lines
> and will be styled appropriately with a left border
> and italic text.

## Horizontal Rule

---

## Mixed Content

You can combine **bold**, *italic*, and \`code\` in the same paragraph. Here's a link to [React documentation](https://react.dev) and some inline math \\(a^2 + b^2 = c^2\\).

### Code without language
\`\`\`
This is a code block without specified language
It will still be formatted nicely
\`\`\`
`;

export default function Home() {
  return (
    <div className="min-h-screen container p-5">
      <Response className="max-w-4xl mx-auto">{markdownContent}</Response>
    </div>
  );
}
