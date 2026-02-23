# Digital Garden Features

Amytis includes a suite of features designed for non-linear knowledge management, inspired by the "Digital Garden" philosophy. These features allow you to create an interconnected web of thoughts rather than just a linear stream of posts.

## Core Concepts

### 1. Notes (`/notes`)
Notes are atomic units of knowledge. Unlike posts, which are often time-bound articles, notes are evergreen and concept-oriented.

- **Location:** `content/notes/*.mdx`
- **Frontmatter:**
  ```yaml
  ---
  title: "Zettelkasten Method"
  tags: ["pkm", "productivity"]
  aliases: ["zettelkasten", "slip-box"] # Alternative names for wiki-linking
  backlinks: true # Show backlinks at the bottom (default: true)
  ---
  ```

### 2. Wiki-links
You can link between any content (Posts, Notes, Flows) using double-bracket syntax: `[[Slug]]` or `[[Slug|Display Text]]`.

- **Standard Link:** `[[zettelkasten-method]]` → links to `/notes/zettelkasten-method`
- **Aliased Link:** `[[zettelkasten-method|The Slip Box]]` → links to same note but displays "The Slip Box"
- **Cross-Type Linking:**
  - If a slug matches a Note, it links to `/notes/[slug]`
  - If it matches a Post, it links to `/posts/[slug]`
  - If it matches a Flow, it links to `/flows/[slug]`

### 3. Backlinks
At the bottom of every Note, Amytis automatically generates a "Linked References" section. This lists every other page that links *to* the current note, along with a context snippet showing how it was referenced.

### 4. Knowledge Graph
The `/graph` route visualizes your entire digital garden as an interactive network graph.
- **Nodes**: Represent Notes, Posts, and Flows.
- **Edges**: Represent wiki-links connecting them.
- **Interaction**: Click a node to navigate to that page.

## How to Use

1. **Create a Note**: Run `bun new "My Concept" --note` (or manually create `content/notes/my-concept.mdx`).
2. **Link to it**: In a blog post or another note, type `[[my-concept]]`.
3. **Explore**: Visit `/notes` to see your collection, or `/graph` to see the connections.

## Configuration

In `site.config.ts`, you can configure the graph visualization:

```typescript
export const siteConfig = {
  // ...
  features: {
    graph: {
      enabled: true,
      name: { en: "Graph", zh: "知识图谱" },
    },
    notes: {
      enabled: true,
      name: { en: "Notes", zh: "笔记" },
    }
  }
};
```
