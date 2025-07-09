export {};

declare global {
  interface User {
    username: string;
    img?: string;
  }

  interface Post {
    _id: string;
    slug: string;
    title: string;
    desc: string;
    img?: string;
    category: string;
    createdAt: string;
    user: User;
  }

  interface PaginatedPosts {
    posts: Post[];
    nextPage: number | null;
  }
}
