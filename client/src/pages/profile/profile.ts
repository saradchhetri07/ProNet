import axios from "axios";
import { Navbar } from "../../components/navbar";
import { accessToken, serverUrl } from "../../constants/constant";
import { PostInterface } from "../../interface/feed";
import { CommentInterface } from "../../interface/comments";
import { myDetails } from "../../constants/constant";
import { customToast } from "../../utils/toast";
class ProfileManager {
  private postIds: string[] = [];
  private posts: PostInterface[] = [];
  private comments: CommentInterface[] = [];
  private profileHeadSection!: HTMLDivElement;
  private profileFeedSection!: HTMLDivElement;
  private profileEditModalContainer!: HTMLDivElement;
  constructor() {
    this.profileFeedSection = document.querySelector(
      "#profile-feed-container",
    )!;
    this.profileHeadSection = document.querySelector("#profile-head")!;

    this.createProfileHead();
    this.addPhotoChangeListeners(this.profileHeadSection, myDetails.myId!);
    this.createEditProfileModal();
    // this.fetchUserDetails();
  }

  private addPhotoChangeListeners(
    profileSection: HTMLElement,
    userId: string,
  ): void {
    const coverPhotoArea = profileSection.querySelector(
      ".cover-photo",
    ) as HTMLElement;
    const profilePhotoArea = profileSection.querySelector(
      ".cover-photo > div",
    ) as HTMLElement;
    const coverPhotoInput = profileSection.querySelector(
      "#cover-photo-input",
    ) as HTMLInputElement;
    const profilePhotoInput = profileSection.querySelector(
      "#profile-photo-input",
    ) as HTMLInputElement;

    if (coverPhotoArea && coverPhotoInput) {
      coverPhotoArea.addEventListener("click", (event) => {
        if (
          event.target === coverPhotoArea ||
          event.target === coverPhotoArea.querySelector("img")
        ) {
          event.preventDefault();
          coverPhotoInput.click();
        }
      });
      coverPhotoInput.addEventListener("change", (event) =>
        this.handlePhotoChange(event, "CoverPhoto", userId),
      );
    }

    if (profilePhotoArea && profilePhotoInput) {
      profilePhotoArea.addEventListener("click", (event) => {
        profilePhotoInput.click();
      });
      profilePhotoInput.addEventListener("change", (event) =>
        this.handlePhotoChange(event, "ProfilePhoto", userId),
      );
    }
  }

  private handlePhotoChange(
    event: Event,
    type: "CoverPhoto" | "ProfilePhoto",
    userId: string,
  ): void {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (file) {
      // Here you would typically upload the file to your server
      // and update the user's profile with the new photo URL

      this.uploadPhoto(file, type)
        .then((newPhotoUrl) => {
          `entered into the upload photo section`;

          // Update the image in the DOM
          const imgElement =
            type === "CoverPhoto"
              ? document.querySelector(".cover-photo img")
              : document.querySelector(".cover-photo > div img");
          if (imgElement) {
            localStorage.setItem(`my${type}Url`, newPhotoUrl!);
            (imgElement as HTMLImageElement).src = newPhotoUrl!;
          }
        })
        .catch((error) => {
          console.error("Error uploading photo:", error);
        });
    }
  }

  private async uploadPhoto(file: File, type: "CoverPhoto" | "ProfilePhoto") {
    const formData = new FormData();
    formData.append(type, file);

    try {
      let response;
      if (type === "CoverPhoto") {
        response = await axios.put(`${serverUrl}/users/coverImage`, formData, {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        });
      } else {
        response = await axios.put(
          `${serverUrl}/users/profileImage`,
          formData,
          {
            headers: {
              Authorization: accessToken ? `Bearer ${accessToken}` : "",
            },
          },
        );
      }

      `gotten response form server is`, response;

      if (!response) {
        throw new Error("Failed to upload photo");
      }

      //toast the update change
      customToast(`${type} updated successfully!`);

      return type === "CoverPhoto"
        ? response.data[0].coverPhotoUrl
        : response.data[0].profilePhotoUrl;
    } catch (error) {
      console.error("Error uploading photo:", error);
      throw error;
    }
  }

  createProfileHead() {
    this.profileHeadSection.innerHTML = /*HTML*/ `
        <div class="profile-section max-w-2xl mt-2 mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">

            <div class="cover-photo h-48 bg-gray-300 relative cursor-pointer">
                <img src=${myDetails.myCoverPhotoUrl} alt="Cover Photo" class="w-full h-full object-cover">
                <input type="file" id="cover-photo-input" class="hidden" accept="image/*" name="coverPhoto">
            
            <div class="absolute bottom-0 left-8 transform translate-y-1/2 cursor-pointer">
              <img src=${myDetails.myProfilePhotoUrl} alt=${myDetails.myName}'s photo" class="w-32 h-32 rounded-full border-4 border-white">
              <input type="file" id="profile-photo-input" class="hidden" accept="image/*" name="profilePhoto">
            </div>

      </div>

    <!-- User Info and Buttons -->
    <div class="p-4 pt-20 sm:p-6 sm:pt-20">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">${myDetails.myName}</h1>
          <p class="text-gray-600">Software Engineer</p>
          <p class="text-sm text-gray-500 mt-1">myDetails.location • myDetails.connections connections</p>
        </div>
        <div>
          <button id="edit-profile" class="bg-primary text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300 font-primary">Edit Profile</button>
        </div>
      </div>

      <!-- Additional User Info -->
      <div class="mt-4">
        <p class="text-gray-700">myDetails.about</p>
      </div>

      <!-- Experience, Education, etc. can be added here -->

    </div>
  </div>
      `;
  }

  createEditProfileModal() {
    this.profileEditModalContainer = document.createElement("div");
    this.profileEditModalContainer.className =
      "fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center hidden";
    this.profileEditModalContainer.id = "create-job-modal";
    this.profileEditModalContainer.innerHTML = /*HTML*/ `
    <div class="bg-white p-6 rounded-lg w-full max-w-md h-[70vh] overflow-scroll hide-scrollbar">
        <h2 class="text-2xl font-bold mb-4 font-primary">Edit Profile</h2>
        <form>
          <!-- Add your form fields here -->
         
              <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2 font-primary" for="headline">
                headline
              </label>
              <textarea class="input-field shadow appearance-none border-2 rounded w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary" id="headline" type="text" placeholder="headline" rows="2" >
              </textarea>
                <span id="headline-error" class="post-error text-red-500 text-xs italic font-primary"></span>
            </div>

            
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2 font-primary" for="summary">
                Summary
              </label>
              <input class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary" id="summary" type="text" placeholder="summary">

              <span id="summary-error" class="post-error text-red-500 text-xs italic font-primary"></span>
            </div>
         

          <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2 font-primary text-sm" for="Industry">
                Industry
              </label>
              <select 
                class="shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary" 
                id="Industry"
              >
                <option value="Engineering and Technology">Engineering and Technology</option>
                <option value="Administrative and Office Support">Administrative and Office Support</option>
                <option value="Healthcare and Medical">Healthcare and Medical</option>
                <option value="Education and Training">Education and Training</option>
                <option value="Finance and Accounting">Finance and Accounting</option>
                <option value="Sales and Marketing">Sales and Marketing</option>
                <option value="Legal and Compliance">Legal and Compliance</option>
                <option value="Science and Research">Science and Research</option>
              </select>
    </div>

        <div class="mb-4">
  
          <label class="block text-gray-700 text-sm font-bold mb-2 font-primary" for="experience">
            Experience
          </label>

          <input class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary" id="Experience" type="text" placeholder="Experience">

          <span id="Experience-error" class="error text-red-500 text-xs italic font-primary"></span>

        </div>

        <div class="mb-4">
  
        <label class="block text-gray-700 text-sm font-bold mb-2 font-primary" for="currentCompany">
          current company
        </label>

        <input class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary" id="CurrentCompany" type="text" placeholder="current company">

        <span id="CurrentCompany-error" class="error text-red-500 text-xs italic font-primary"></span>

      </div>


      <div class="mb-4">
  
      <label class="block text-gray-700 text-sm font-bold mb-2 font-primary" for="currentCompany">
        current position
      </label>

      <input class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary" id="CurrentPosition" type="text" placeholder="current position">

      <span id="CurrentPosition-error" class="error text-red-500 text-xs italic font-primary"></span>

    </div>

          <!-- Add more form fields as needed -->
          <div class="flex items-center justify-between">
            <button class="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
            font-primary
            " type="button"
            id="submitButton"
            >
              Submit
            </button>
            <button class="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline font-primary" type="button" data-close-button>
              Close
            </button>
          </div>
        </form>
      </div>`;

    document.body.appendChild(this.profileEditModalContainer);
  }

  private showJobModal() {
    `inside show job modal`;
    `profile modal container is`, this.profileEditModalContainer;

    this.profileEditModalContainer.classList.remove("hidden");
  }

  private hideJobModal() {
    //this.resetInitialField();
    this.profileEditModalContainer.classList.add("hidden");
  }

  async fetchPosts(): Promise<void> {
    try {
      // Configure axios request with headers
      const response = await axios.get(`${serverUrl}/posts/myPosts`, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response) {
        throw new Error("Network response was not ok");
      }
      `profile fetch posts`, response.data;

      this.posts = response.data;
      this.getMyPosts("5");
    } catch (error) {
      return;
    }
  }

  attachButtonListeners() {
    const likeButtons =
      this.profileFeedSection.querySelectorAll(".like-button");
    likeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const icon = button.querySelector("i");
        if (icon) {
          this.toggleLike(icon);
        }
      });
    });

    const commentButtons =
      this.profileFeedSection.querySelectorAll(".comment-button");
    commentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const postId = button.getAttribute("data-post-id");
        if (postId) {
          this.toggleComments(postId);
        }
      });
    });

    document.addEventListener("click", this.handleDocumentClick.bind(this));

    const editProfileButton = document.querySelector("#edit-profile");

    editProfileButton?.addEventListener("click", () => this.showJobModal());

    this.profileEditModalContainer.addEventListener("click", (e) => {
      if (e.target === this.profileEditModalContainer) {
        this.hideJobModal();
      }
    });

    const closeButton = this.profileEditModalContainer.querySelector(
      "[data-close-button]",
    );

    if (closeButton) {
      closeButton.addEventListener("click", () => this.hideJobModal());
    }

    const submitButton = document.querySelector("#submitButton");

    submitButton?.addEventListener("click", () => this.editProfile());
  }
  private async editProfile(): Promise<void> {
    const headline = (
      document.getElementById("headline") as HTMLTextAreaElement
    ).value;
    const summary = (document.getElementById("summary") as HTMLInputElement)
      .value;
    const industry = (document.getElementById("Industry") as HTMLInputElement)
      .value;
    const experience = (
      document.getElementById("Experience") as HTMLInputElement
    ).value;
    const currentCompany = (
      document.getElementById("CurrentCompany") as HTMLInputElement
    ).value;
    const currentPosition = (
      document.getElementById("CurrentPosition") as HTMLInputElement
    ).value;
    const profileData = {
      headline,
      // summary,
      // industry,
      // experience,
      // currentCompany,
      // currentPosition,
    };
    `retrieved profile data is`, profileData;
  }

  private handleDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (target.closest(".more-options-button")) {
      this.toggleOptionsMenu(target);
    } else {
      this.closeAllMenus();
    }
  }

  private toggleOptionsMenu(target: HTMLElement): void {
    const button = target.closest(".more-options-button") as HTMLElement;
    const postId = button.dataset.postId;
    const menu = button
      .closest(".relative")
      ?.querySelector(".more-options-menu") as HTMLElement;
    menu.classList.toggle("hidden");
  }

  private closeAllMenus(): void {
    document.querySelectorAll(".more-options-menu").forEach((menu) => {
      (menu as HTMLElement).classList.add("hidden");
    });
  }

  toggleLike(likeIcon: HTMLElement) {
    likeIcon.classList.toggle("liked");
  }

  private getMyPosts(userId: string) {
    this.posts = this.posts.filter((post) => post.userId === userId);
    `posts are`, this.posts;
  }

  toggleComments(postId: string) {
    const postElement = this.profileFeedSection
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

  populateComments(postId: string) {
    const postElement = this.profileFeedSection
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

  setPostsIds() {
    this.posts.forEach((post) => {
      this.postIds.push(post.postId);
    });
  }

  async renderFeed() {
    await this.fetchPosts();
    this.getMyPosts("5");
    this.profileFeedSection.innerHTML = "";
    this.posts.forEach((post) => {
      const postElement = this.createPostElement(post);
      this.profileFeedSection.appendChild(postElement);

      const deleteButton = postElement.querySelector(
        `#delete-post-${post.postId}`,
      );
      if (deleteButton) {
        deleteButton.addEventListener("click", () =>
          this.handleDeletePost(post.postId),
        );
      }
    });

    this.attachButtonListeners();
  }

  async handleDeletePost(postId: string) {
    try {
      const response = await axios.delete(`${serverUrl}/`);
    } catch (error) {}
  }

  formatTimestamp(timestamp: string): string {
    // Implement your timestamp formatting logic here
    return new Date(timestamp).toLocaleString();
  }

  createPostElement(post: PostInterface): HTMLElement {
    const postElement = document.createElement("div");
    postElement.className =
      "mt-4 flex-col bg-white shadow mb-4 max-w-2xl mx-auto border-2 border-gray-300 rounded-3xl overflow-hidden p-4";
    postElement.innerHTML = /*html*/ `
                <div class=" border-gray-300 overflow-hidden p-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <img class="w-12 h-12 rounded-full mr-4 font-primary" src="${post.profilePhotoUrl}" alt="${post.name}'s avatar">
                        <div>
                            <h3 class="font-semibold text-gray-900 font-primary">${post.name}</h3>
                            <p class="text-sm text-gray-500 font-primary">Software Engineer</p>
                            <p class="text-xs text-gray-400 font-primary">${this.formatTimestamp(post.createdAt!)} • <span class="text-gray-500">🌍</span></p>
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
            </div>
        `;
    return postElement;
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
}

document.addEventListener("DOMContentLoaded", async () => {
  const navbar = new Navbar("navbar-container");
  navbar.render();
  navbar.highlightActivePage();

  const profileManager = new ProfileManager();
  await profileManager.renderFeed();
  // await profileManager.fetchComments();
});
