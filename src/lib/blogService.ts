// This layer simulates a backend API.
// Replacing it with real HTTP calls would not affect UI code.
export interface Blog {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: string;
  readTime: string;
  createdAt: string;
}

const STORAGE_KEY = "blog-app-data";

const coverImages = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=400&fit=crop",
];

const mockBlogs: Blog[] = [
  {
    id: "1",
    title: "The Future of Fintech in 2024",
    description: "Exploring how AI and blockchain are reshaping financial services.",
    content: `The intersection of finance and technology has never been more vibrant.

## The Rise of Automated Accounting

Automation is no longer a buzzword; it's a reality. Routine tasks like data entry and reconciliation are being automated at an unprecedented pace.

- Strategic financial planning and analysis
- Risk management and compliance auditing
- Advisory services for business growth

## Blockchain: Beyond Cryptocurrency

The immutable ledger provides a "single source of truth" that could eliminate the need for sampling in audits.

> "The accountant of the future will be a data scientist, a storyteller, and a strategic partner."

## Preparing for the Shift

To stay relevant, professionals must upskill in Python, PowerBI, and AI-driven ERP systems.`,
    category: "Finance",
    tags: ["Featured", "Fintech"],
    coverImage: coverImages[0],
    author: "Arjun Mehta",
    readTime: "5 min read",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Ace Your CA Finals",
    description: "Strategies to clear your exams in the first attempt without burning out.",
    content: `Preparing for CA Finals requires a strategic approach.

## Create a Realistic Study Schedule

The key to success is consistency over intensity. Break down your syllabus into manageable chunks.

## Focus on Conceptual Clarity

Don't just memorize—understand. When you grasp the underlying concepts, you can tackle any variation.

## Practice Previous Year Papers

Nothing beats solving actual exam papers under timed conditions.`,
    category: "Career",
    tags: ["Study Tips"],
    coverImage: coverImages[1],
    author: "Priya Sharma",
    readTime: "4 min read",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    title: "Understanding Tax Reforms",
    description: "A breakdown of new tax laws and their impact on businesses.",
    content: `The new tax reforms bring significant changes for businesses.

## Key Changes in Corporate Taxation

The revised structure aims to simplify compliance while encouraging investment.

## Impact on Small Businesses

SMEs will see reduced compliance burden and simplified filing procedures.`,
    category: "Regulations",
    tags: ["Taxation"],
    coverImage: coverImages[2],
    author: "Vikram Singh",
    readTime: "6 min read",
    createdAt: "2024-01-25",
  },
];

const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const hasValidFormat = (data: any[]): boolean => {
  if (!Array.isArray(data) || !data.length) return false;
  return data[0]?.description && Array.isArray(data[0]?.tags);
};

const load = (): Blog[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const data = JSON.parse(raw);
      if (hasValidFormat(data)) return data;
    } catch {}
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockBlogs));
  return mockBlogs;
};

const save = (blogs: Blog[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
};

// Public API

export const getBlogs = async (): Promise<Blog[]> => {
  await wait(400);
  return load();
};

export const getBlogById = async (id: string): Promise<Blog | null> => {
  await wait(200);
  return load().find((b) => b.id === id) || null;
};

export const createBlog = async (
  data: Omit<Blog, "id" | "createdAt" | "readTime">
): Promise<Blog> => {
  await wait(300);
  const blogs = load();
  const post: Blog = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
    readTime: `${Math.max(1, Math.ceil(data.content.split(" ").length / 200))} min read`,
  };
  save([post, ...blogs]);
  return post;
};

export const updateBlog = async (id: string, data: Partial<Blog>): Promise<Blog> => {
  await wait(300);
  const blogs = load();
  const idx = blogs.findIndex((b) => b.id === id);
  if (idx === -1) throw new Error("Blog not found");
  const updated = { ...blogs[idx], ...data };
  blogs[idx] = updated;
  save(blogs);
  return updated;
};

export const deleteBlog = async (id: string): Promise<void> => {
  await wait(200);
  save(load().filter((b) => b.id !== id));
};

export const categories = ["Finance", "Career", "Regulations", "Skills", "Technology"];
