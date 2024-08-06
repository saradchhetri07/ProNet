import { myDetails } from "./../../constants/constant";
import { PostInterface } from "../../interface/feed";
import { formatTimestamp } from "../../utils/formatTime";
import { ProfileDetailsInterface } from "../../interface/profileInterface";

export const PostElement = (post: PostInterface) => {
  return /*HTML*/ `
     <div class="border-2 border-gray-300 rounded-3xl overflow-hidden p-4">
                <div class="flex items-center">
                    <img class="w-12 h-12 rounded-full mr-4 font-primary" src="${post.profilePhotoUrl}" alt="${post.name}'s avatar">
                    <div>
                        <h3 class="font-semibold text-gray-900 font-primary">${post.name}</h3>
                        <p class="text-xs text-gray-400 font-primary">${formatTimestamp(post.createdAt!)} • <span class="text-gray-500">🌍</span></p>
                    </div>
                </div>
            </div>
            
            <div class="p-4">
                <p class="text-gray-800 font-primary">${post.content}</p>
            </div>
            ${post.mediaUrl ? `<img class="w-full rounded-3xl" src="${post.mediaUrl}" alt="Post image">` : ""}

            <div class="px-4 py-2 border-b border-gray-200">
                <div class="flex items-center text-sm text-gray-500">
                    <span data-post-id="${post.postId}" id="like-count-${post.postId}" class="mr-2 like-count font-primary">👍❤️ ${post.likeCount === null ? "0" : post.likeCount} likes</span>

                    <span id="comment-count-${post.postId}" class="mr-2 like-count font-primary">${post.commentCount === null ? "0" : post.commentCount} comments 
                    </span>
                </div>
            </div>
            
                    <div class="flex justify-evenly px-4 py-2">
            <button class="like-button flex items-center text-gray-600 hover:bg-gray-100 px-2 py-1 rounded font-primary"
            data-post-id="${post.postId}">
              <i class="fas fa-thumbs-up ${post.likedByCurrentUser !== null && post.likedByCurrentUser ? "liked" : ""}"></i>
              Like
            </button>
            <button class="comment-button flex mr-2 items-center text-gray-600 hover:bg-gray-100 px-2 py-1 rounded font-primary" 
            data-post-id="${post.postId}">
              <i class="fa-solid fa-comment"></i>
              Comment
            </button>
          </div>
          
          <div class="comments-section hidden h-0 transition-all duration-75 ease-in-out overflow-hidden">
              <div class="comments-container h-64 overflow-y-auto p-4">
                <!-- Comments will be dynamically added here -->
              </div>
          <div class="comment-input-container p-4 border-t mb-4">
            <input data-post-id="${post.postId}" type="text" placeholder="Add a comment..." class="comment-input w-full p-2 border rounded-full mb-2">
          </div>
        </div>
        `;
};
