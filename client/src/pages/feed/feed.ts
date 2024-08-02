import { PostInterface } from "./../../interface/feed";
import { CommentInterface } from "../../interface/comments";
import axios from "axios";
import { serverUrl } from "../../constants/constant";
// import { usePostStore } from "../../state/feedState";
import { accessToken } from "../../constants/constant";
import Toastify from "toastify-js";
import { Navbar } from "../../components/navbar";

export class FeedManager {
  private feedContainer!: HTMLDivElement;
  postIds: string[] = [];
  posts: PostInterface[] = [];
  comments: CommentInterface[] = [];

  constructor(containerId: string) {
    const container = document.getElementById(containerId) as HTMLDivElement;

    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.feedContainer = container;
  }

  async fetchPosts(): Promise<void> {
    try {
      // Configure axios request with headers
      const response = await axios.get(
        `${serverUrl}/posts/getPosts?sortPref=date`,
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
            "Content-Type": "application/json", // Optional: specify content type if needed
          },
        },
      );

      if (!response) {
        throw new Error("Network response was not ok");
      }
      this.posts = response.data;
    } catch (error) {
      return;
    }
  }
  getposts(userId: string) {
    this.posts = this.posts.filter((post) => post.userId === userId);
  }
  setPostsIds() {
    this.posts.forEach((post) => {
      this.postIds.push(post.postId);
    });
  }

  async fetchComments(): Promise<void> {
    try {
      this.setPostsIds();

      const postIdsParam = this.postIds.join(",");
      // Configure axios request with headers
      const response = await axios.get(
        `${serverUrl}/posts/comments?postIds=${postIdsParam}`,
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
            "Content-Type": "application/json", // Optional: specify content type if needed
          },
        },
      );

      if (!response) {
        throw new Error("Network response was not ok");
      }
      this.comments = response.data.comments;
    } catch (error) {
      return;
    }
  }
  createPostElement(post: PostInterface): HTMLElement {
    const postElement = document.createElement("div");
    postElement.className =
      "mt-4 flex-col bg-white shadow mb-4 max-w-2xl mx-auto border-2 border-gray-300 rounded-3xl overflow-hidden p-4";
    postElement.innerHTML = /*html*/ `
            <div class="border-2 border-gray-300 rounded-3xl overflow-hidden p-4">
                <div class="flex items-center">
                    <img class="w-12 h-12 rounded-full mr-4 font-primary" src="${post.profilePhotoUrl}" alt="${post.name}'s avatar">
                    <div>
                        <h3 class="font-semibold text-gray-900 font-primary">${post.name}</h3>
                        <p class="text-sm text-gray-500 font-primary">Software Engineer</p>
                        <p class="text-xs text-gray-400 font-primary">${this.formatTimestamp(post.createdAt!)} • <span class="text-gray-500">🌍</span></p>
                    </div>
                </div>
            </div>
            
            <div class="p-4">
                <p class="text-gray-800 font-primary">${post.content}</p>
            </div>
            ${post.mediaUrl ? `<img class="w-full rounded-3xl" src="${post.mediaUrl}" alt="Post image">` : ""}

            <div class="px-4 py-2 border-b border-gray-200">
                <div class="flex items-center text-sm text-gray-500">
                    <span class="mr-2 like-count font-primary">👍❤️ ${post.likeCount === null ? "0" : post.likeCount} likes</span>
                    <span>${post.commentCount === null ? "0" : post.commentCount} comments 
                </div>
            </div>
            
                    <div class="flex justify-evenly px-4 py-2">
            <button class="like-button flex items-center text-gray-600 hover:bg-gray-100 px-2 py-1 rounded font-primary"
            data-post-id="${post.postId}">
              <i class="fas fa-thumbs-up"></i>
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
            <input type="text" placeholder="Add a comment..." class="w-full p-2 border rounded-full mb-2">
          </div>
        </div>
        `;
    return postElement;
  }

  populateComments(postId: string) {
    const postElement = this.feedContainer
      .querySelector(`[data-post-id="${postId}"]`)!
      .closest(".mt-4");
    if (postElement) {
      const commentsContainer = postElement.querySelector(
        ".comments-container",
      );
      if (commentsContainer) {
        commentsContainer.innerHTML = ""; // Clear existing comments

        if (!Array.isArray(this.comments)) {
          console.error("Comments is not an array:", this.comments);
          return;
        }

        const relevantComments = this.comments.filter(
          (comment) => comment.postId === postId,
        );

        relevantComments.forEach((comment) => {
          const commentElement = document.createElement("div");
          commentElement.className = "comment mb-4 flex items-start";
          commentElement.innerHTML = `
            <img src="${comment.profilePhotoUrl}" alt="${comment.name}" class="w-8 h-8 rounded-full mr-3">
            <div class="flex-grow">
              <div class="bg-gray-100 rounded-lg p-3">
                <p class="font-semibold">${comment.name}</p>
                <p class="text-sm">${comment.content}</p>
              </div>
              <p class="text-xs text-gray-500 mt-1">${this.formatTimestamp(comment.commentDate)}</p>
            </div>
          `;
          commentsContainer.appendChild(commentElement);
        });
      }
    }
  }

  formatTimestamp(timestamp: string): string {
    // Implement your timestamp formatting logic here
    return new Date(timestamp).toLocaleString();
  }

  async renderFeed() {
    await this.fetchPosts();

    this.feedContainer.innerHTML = "";
    this.posts.forEach((post) => {
      const postElement = this.createPostElement(post);
      this.feedContainer.appendChild(postElement);
    });
    this.attachButtonListeners();
  }

  attachButtonListeners() {
    const likeButtons = this.feedContainer.querySelectorAll(".like-button");
    likeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const icon = button.querySelector("i");
        if (icon) {
          this.toggleLike(icon);
        }
      });
    });

    const commentButtons =
      this.feedContainer.querySelectorAll(".comment-button");
    commentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const postId = button.getAttribute("data-post-id");
        if (postId) {
          this.toggleComments(postId);
        }
      });
    });
  }

  toggleComments(postId: string) {
    const postElement = this.feedContainer
      .querySelector(`[data-post-id="${postId}"]`)!
      .closest(".mt-4");

    if (postElement) {
      const commentsSection = postElement.querySelector(
        ".comments-section",
      ) as HTMLElement;
      if (commentsSection) {
        // Toggle visibility
        commentsSection.classList.toggle("hidden");
        if (!commentsSection.classList.contains("hidden")) {
          // Hide comments section
          commentsSection.style.height = "320px"; // Adjust this value as needed
          this.populateComments(postId);
        } else {
          commentsSection.style.height = "0";
        }
      }
    }
  }

  toggleLike(likeIcon: HTMLElement) {
    likeIcon.classList.toggle("liked");
  }
}

class FeedForm {
  private photoButton: HTMLButtonElement;
  private fileInput: HTMLInputElement;
  private imagePreview: HTMLDivElement;
  private selectedImage: HTMLImageElement;
  private postContent: HTMLTextAreaElement;
  private postButton: HTMLButtonElement;
  private formContainer: HTMLDivElement;
  private content?: string;
  private imageFile?: File;
  constructor() {
    this.photoButton = document.getElementById(
      "photo-button",
    ) as HTMLButtonElement;
    this.fileInput = document.getElementById("post-media") as HTMLInputElement;
    this.imagePreview = document.getElementById(
      "image-preview",
    ) as HTMLDivElement;
    this.selectedImage = document.getElementById(
      "selected-image",
    ) as HTMLImageElement;
    this.postContent = document.getElementById(
      "post-content",
    ) as HTMLTextAreaElement;
    this.postButton = document.getElementById(
      "post-button",
    ) as HTMLButtonElement;
    this.formContainer = this.postContent.closest(
      ".feed__post-form",
    ) as HTMLDivElement;

    this.init();
  }

  private init() {
    this.setUserDetails();
    this.photoButton.addEventListener("click", () => this.fileInput.click());
    this.fileInput.addEventListener("change", (e) => this.handleFileSelect(e));
    this.postButton.addEventListener("click", () => this.handlePost());
    this.postContent.addEventListener("input", (event) =>
      this.handleContent(event),
    );
  }
  async setUserDetails() {
    try {
      const response = await axios.get(`${serverUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data) {
        localStorage.setItem("myId", JSON.stringify(response.data[0].id));
        localStorage.setItem("myName", JSON.stringify(response.data[0].name));
        localStorage.setItem("myEmail", JSON.stringify(response.data[0].email));
        localStorage.setItem(
          "myProfilePhotoUrl",
          JSON.stringify(response.data[0].profilePhotoUrl),
        );
        localStorage.setItem(
          "myCoverPhotoUrl",
          JSON.stringify(response.data[0].coverPhotoUrl),
        );
      }
    } catch (error) {
      throw new Error("failed to save user details");
    }
  }
  private handleContent(event: any) {
    this.content = (event.target as HTMLTextAreaElement).value;
  }

  private handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage.src = e.target?.result as string;
        this.imagePreview.classList.remove("hidden");
        this.adjustFormHeight();
      };
      reader.readAsDataURL(file);
    }
  }

  private adjustFormHeight() {
    // Add a class to increase the height of the form container
    this.formContainer.classList.add("expanded");
  }

  private async handlePost() {
    this.imageFile = this.fileInput.files?.[0];

    // Clear the form after posting
    this.postContent.value = "";
    this.fileInput.value = "";
    this.imagePreview.classList.add("hidden");
    this.formContainer.classList.remove("expanded");

    //adding the post to the database

    try {
      // Create FormData object to send the file and content
      const formData = new FormData();
      const data = {
        content: this.content,
      };
      if (this.content !== undefined) {
        formData.append("content", this.content);
      }
      if (this.imageFile) {
        formData.append("postMedia", this.imageFile);
      }

      // Post the data to your API endpoint
      const response = await axios.post(`${serverUrl}/posts`, formData, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error posting data:", error);
    }
  }
}

// Usage
document.addEventListener("DOMContentLoaded", async () => {
  const navbar = new Navbar("navbar-container");
  navbar.render();
  navbar.highlightActivePage();

  const feedManager = new FeedManager("feed-container");
  new FeedForm();
  await feedManager.renderFeed();
  await feedManager.fetchComments();
});
