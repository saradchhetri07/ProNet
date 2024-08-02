import { BadRequestError } from "../errors/BadRequest.errors";
import { NotFoundError } from "../errors/NotFound.errors";
import { ServerError } from "../errors/ServerError.errors";
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
    try {
      console.log(`userIds `, userIds);

      const likesCountSubquery = this.queryBuilder()
        .table("likes as l")
        .select("l.post_id")
        .count("l.post_id as like_count")
        .groupBy("l.post_id")
        .as("likes_count"); // Alias for the subquery;

      const commentsSubQuery = this.queryBuilder()
        .table("comments as c")
        .select("c.post_id")
        .count("c.post_id as comment_count")
        .groupBy("c.post_id")
        .as("comments_count");

      const posts = await this.queryBuilder()
        .table("posts as p")
        .innerJoin("users as u", "p.user_id", "u.id")
        .innerJoin("posts_media as m", "p.post_id", "m.post_id")
        .leftJoin(likesCountSubquery, "p.post_id", "likes_count.post_id")
        .leftJoin(commentsSubQuery, "p.post_id", "comments_count.post_id")
        .select(
          "p.post_id",
          "p.content",
          "p.created_at",
          "u.id as userId",
          "u.name",
          "u.profile_photo_url",
          "m.media_url",
          "likes_count.like_count",
          "comments_count.comment_count"
        )
        .whereIn("p.user_id", userIds)
        .orderBy("p.created_at", "asc");

      if (!posts) {
        throw new NotFoundError("posts not found");
      }
      return posts;
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerError(error.message);
      }
    }
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

  static async insertLikes(postId: string, userId: string) {
    try {
      const likeData = {
        postId: postId,
        userId: userId,
      };
      const isLiked = await this.queryBuilder().table("likes").insert(likeData);

      return isLiked;
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerError(`${error.message}`);
      }
    }
  }

  static async insertComments(userId: string, postId: string, content: string) {
    try {
      const commentToPost = {
        userId: parseInt(userId, 10),
        postId: parseInt(postId, 10),
        content: content,
      };

      console.log(`commentToPost`, commentToPost);

      const isCreated = await this.queryBuilder()
        .table("comments")
        .insert(commentToPost);

      return isCreated;
    } catch (error: any) {
      throw new ServerError(error.message);
    }
  }

  static async getComments(postId: number[]) {
    try {
      const comments = await this.queryBuilder()
        .table("users as u")
        .innerJoin("comments as c", "c.user_id", "u.id")
        .select(
          "u.profile_photo_url",
          "u.name",
          "c.content",
          "c.post_id",
          "c.comment_date"
        )
        .whereIn("c.post_id", postId);

      return comments;
    } catch (error) {
      if (error instanceof Error) {
        console.log(`inside get comments error handler`, error.message);
        throw new ServerError(error.message);
      }
    }
  }

  static async getMyPosts(userId: string) {
    try {
      const likesCountSubquery = this.queryBuilder()
        .table("likes as l")
        .select("l.post_id")
        .count("l.post_id as like_count")
        .groupBy("l.post_id")
        .as("likes_count"); // Alias for the subquery;

      const commentsSubQuery = this.queryBuilder()
        .table("comments as c")
        .select("c.post_id")
        .count("c.post_id as comment_count")
        .groupBy("c.post_id")
        .as("comments_count");

      const posts = await this.queryBuilder()
        .table("posts as p")
        .innerJoin("users as u", "p.user_id", "u.id")
        .innerJoin("posts_media as m", "p.post_id", "m.post_id")
        .leftJoin(likesCountSubquery, "p.post_id", "likes_count.post_id")
        .leftJoin(commentsSubQuery, "p.post_id", "comments_count.post_id")
        .select(
          "p.post_id",
          "p.content",
          "p.created_at",
          "u.id as userId",
          "u.name",
          "u.profile_photo_url",
          "m.media_url",
          "likes_count.like_count",
          "comments_count.comment_count"
        )
        .where("p.user_id", userId)
        .orderBy("p.created_at", "asc");
      return posts;
    } catch (error) {
      throw new ServerError("Internal Server Error");
    }
  }
  static async deleteMyPost(userId: string, postId: string) {
    try {
      const isDeleted = await this.queryBuilder()
        .table("posts")
        .where({ userId: userId, post_id: postId })
        .delete();

      return isDeleted;
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerError("Internal server error");
      }
    }
  }
}
