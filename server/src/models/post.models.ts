import { BadRequestError } from "../errors/BadRequest.errors";
import { NotFoundError } from "../errors/NotFound.errors";
import { Post } from "../interfaces/post.interface";
import { BaseModel } from "./base.models";

export class PostModel extends BaseModel {
  static async postPost(body: Post, userId: string) {
    const postToCreate = {
      userId: userId,
      content: body.content,
      privacy: body.privacy,
    };

    const [postId] = await this.queryBuilder()
      .insert(postToCreate)
      .table("posts")
      .returning("post_id");

    if (!postId) {
      throw new BadRequestError("post not created");
    }
    return postId;
  }

  static async getPostByDate(userIds: string[]) {
    const posts = this.queryBuilder()
      .select("posts.*")
      .table("posts")
      .whereIn("user_id", userIds)
      .orderBy("created_at", "desc");

    if (!posts) {
      throw new NotFoundError("posts not found");
    }
    return posts;
  }

  static async createPostMedia(
    postId: string,
    mediaUrl: string,
    mediaType: string,
    userId: string
  ) {
    const postMediaToInsert = {
      postId: postId,
      mediaUrl: mediaUrl,
      mediaType: mediaType,
      userId: +userId,
    };

    const [post_media_id] = await this.queryBuilder()
      .insert(postMediaToInsert)
      .table("posts_media")
      .returning("post_media_id");

    if (!post_media_id) {
      throw new BadRequestError("post media not created");
    }
    return post_media_id;
  }
}
