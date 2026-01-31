---
title: "Testing Markdown Support"
date: "2025-01-30"
excerpt: "A test post to verify markdown rendering and syntax highlighting."
---

This is a test post to verify that markdown support is working correctly.

## Headings Work

Here's a paragraph with **bold text** and *italic text*. We can also use `inline code` for technical terms.

### Subheading

Lists are supported:

- First item
- Second item
- Third item with a [link](https://example.com)

Numbered lists too:

1. Step one
2. Step two
3. Step three

## Code Blocks

Here's a TypeScript example with syntax highlighting:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return `Hello, ${user.name}!`;
}
```

And a JavaScript example:

```javascript
const sum = (a, b) => a + b;
console.log(sum(1, 2));
```

## Blockquotes

> This is a blockquote. It can span multiple lines and contain **formatted text**.

## Conclusion

If you can see this post with proper formatting, the markdown support is working.
