export {};

declare global {
  interface User {
    username: string;
    img?: string;
    clerkId?: string;
  }

  interface Post {
    _id: string;
    slug: string;
    title: string;
    desc: string;
    img?: string;
    category: string;
    createdAt: string;
    content?: strinf;
    user: User;
    visit?: number;
  }

  interface PaginatedPosts {
    posts: Post[];
    nextPage: number | null;
  }
}
