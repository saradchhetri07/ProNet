import create from "zustand";
import { PostInterface } from "../interface/feed";

export interface PostStore {
  posts: PostInterface[];
  updateLikeCount: (postId: string, increment: boolean) => void;
  setPosts: (post: PostInterface[]) => void;
}

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  updateLikeCount: (postId, increment) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.postId === postId
          ? { ...post, likeCount: post.likeCount! + (increment ? 1 : -1) }
          : post,
      ),
    })),
  setPosts: (posts) => set({ posts }),
}));
