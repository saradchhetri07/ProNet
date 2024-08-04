import { PostInterface } from "../../interface/feed";
import { ProfileDetailsInterface } from "../../interface/profileInterface";
import { formatTimestamp } from "../../utils/formatTime";

export const CreatePost = (
  post: PostInterface,
  details: ProfileDetailsInterface,
) => {
  return /*HTML*/ `<div class=" border-gray-300 overflow-hidden p-4">
  <div class="flex items-center justify-between">
      <div class="flex items-center">
          <img class="w-12 h-12 rounded-full mr-4 font-primary" src="${post.profilePhotoUrl}" alt="${post.name}'s avatar">
          <div>
              <h3 class="font-semibold text-gray-900 font-primary">${post.name}</h3>
              <p class="text-sm text-gray-500 font-primary">${details.currentPosition}</p>
              <p class="text-xs text-gray-400 font-primary">${formatTimestamp(post.createdAt!)} • <span class="text-gray-500">🌍</span></p>
          </div>
      </div>
      <div class="relative">
          <button class="text-gray-500 hover:text-gray-700 focus:outline-none more-options-button" data-post-id="${post.postId}">
              <i class="fas fa-ellipsis-h"></i>
          </button>

          <div class="absolute right mt-1 w-48 bg-white rounded-lg shadow-lg hidden more-options-menu">
              <div class="py-1">
                  <button id= "delete-post-${post.postId}" class="px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 delete-post-option font-primary"> Delete 
                  </button>
              </div>
          </div>
      </div>
  </div>
</div>

<div class="p-4">
  <p class="text-gray-800 font-primary">${post.content}</p>
</div>
${post.mediaUrl ? `<img class="w-full rounded-3xl" src="${post.mediaUrl}" alt="Post image">` : ""}

<div class="px-4 py-2 border-b border-gray-200">
  <div class="flex items-center text-sm text-gray-500">
      <span class="mr-2 like-count font-primary">👍❤️ ${post.likeCount === null ? "0" : post.likeCount}
          likes</span>
      <span>${post.commentCount === null ? "0" : post.commentCount} comments
  </div>
</div>

<div class="flex justify-evenly px-4 py-2">
  <button class="like-button flex items-center text-gray-600 hover:bg-gray-100 px-2 py-1 rounded font-primary"
      data-post-id="${post.postId}">
      <i class="fas fa-thumbs-up"></i>
      Like
  </button>
  <button
      class="comment-button flex mr-2 items-center text-gray-600 hover:bg-gray-100 px-2 py-1 rounded font-primary"
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
      <input type="text" placeholder="Add a comment..." class="w-full p-2 border rounded-full mb-2">
  </div>
</div>;`; /*HTML*/
};
