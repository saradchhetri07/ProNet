import { PostInterface } from "./../../interface/feed";
import { CommentInterface } from "../../interface/comments";
import axios from "axios";
import { myDetails, serverUrl } from "../../constants/constant";
// import { usePostStore } from "../../state/feedState";
import { accessToken } from "../../constants/constant";
import Toastify from "toastify-js";
import { Navbar } from "../../components/navbar";
import { PostElement } from "./postElement";
import { formatTimestamp } from "../../utils/formatTime";
import { customToast } from "../../utils/toast";
import { getCurrentDate } from "../../utils/currentDate";
import { removeQuote } from "../../utils/remoteQuote";

export class FeedManager {
  feedContainer!: HTMLDivElement;
  postIds: string[] = [];
  posts: PostInterface[] = [];
  comments: CommentInterface[] = [];
  likeCount?: number;
  commentCount?: number;

  constructor(containerId: string) {
    const container = document.getElementById(containerId) as HTMLDivElement;

    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.feedContainer = container;
    this.init();
  }

  private async init() {
    this.fetchPosts();
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
        customToast("Error fetching posts");
      }
      this.posts = response.data;
    } catch (error) {
      customToast("Error fetching posts");
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
    postElement.innerHTML = PostElement(post);
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
              <p class="text-xs text-gray-500 mt-1">${formatTimestamp(comment.commentDate as string)}</p>
            </div>
          `;
          commentsContainer.appendChild(commentElement);
        });
      }
    }
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

    const inputFields = this.feedContainer.querySelectorAll(".comment-input");

    inputFields.forEach((input) => {
      const inputElement = input as HTMLInputElement;
      console.log(input);
      input.addEventListener("keydown", (event: Event) => {
        const keyboardEvent = event as KeyboardEvent;
        const postId = input.getAttribute("data-post-id");

        if (keyboardEvent.key === "Enter") {
          // Prevent the default action (if any)
          keyboardEvent.preventDefault();
          const commentData = {
            profilePhotoUrl: removeQuote(myDetails.myProfilePhotoUrl),
            name: myDetails.myName,
            content: inputElement.value,
            postId: input.getAttribute("data-post-id"),
            commentDate: getCurrentDate(),
          };

          this.comments.push(commentData);
          this.populateComments(postId as string);
          this.insertComments(commentData);
          inputElement.value = "";
          this.incrementCommentValue(postId as string);
        }
      });
      // const postId = input.getAttribute("data-post-id");
      // console.log(`post data id is`, postId);
    });
  }
  private async incrementCommentValue(postId: string) {
    const commentCountElement = document.getElementById(
      `comment-count-${postId}`,
    );

    if (commentCountElement) {
      // Extract the current count from the span text content
      const currentCount = parseInt(
        commentCountElement.textContent!.split(" ")[0],
        10,
      );

      // Increment the count
      const newCount = currentCount + 1;

      // Update the span with the new count
      commentCountElement.textContent = `${newCount} comments`;
    }
  }
  private async changeLikeCount(postId: string, increase: boolean = false) {
    const likeCountElement = document.getElementById(`like-count-${postId}`);

    if (likeCountElement) {
      // Extract the current count from the span text content
      const currentCount = parseInt(
        likeCountElement.textContent!.split(" ")[0],
        10,
      );

      // Increment the count
      const newCount = currentCount + 1;
      console.log(`new count is`, newCount);

      // Update the span with the new count
      likeCountElement.textContent = `${newCount} likes`;
    }
  }
  async insertComments(commentData: CommentInterface) {
    try {
      console.log("response comment", `${serverUrl}/${commentData.postId!}`);
      const content = {
        content: commentData.content,
      };
      const response = await axios.post(
        `${serverUrl}/posts/comment/${commentData.postId!}`,
        content,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(`response looks like`, response);
      customToast(response.data.message);
    } catch (error: any) {
      customToast(error);
    }
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
    console.log(`came to toggle`);

    likeIcon.classList.toggle("liked");
    const postId = likeIcon.getAttribute("data-post-id");
    console.log(`post id is`, postId);

    if (likeIcon.classList.contains("liked")) {
      this.changeLikeCount(postId as string, true);
    }
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
        localStorage.setItem("myName", response.data[0].name);
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
      console.error("Error posting dfata:", error);
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

  const inputFields =
    feedManager.feedContainer.querySelectorAll("comment-input");

  inputFields.forEach((input) => {
    console.log(input);

    const postId = input.getAttribute("data-post-id");
    console.log(`post data id is`, postId);
  });

  await feedManager.renderFeed();
  await feedManager.fetchComments();
});
