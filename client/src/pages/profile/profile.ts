import { myDetails } from "./../../constants/constant";
import { ProfileDetailsInterface } from "../../interface/profileInterface";
import axios from "axios";
import { Navbar } from "../../components/navbar";
import { accessToken, serverUrl } from "../../constants/constant";
import { PostInterface } from "../../interface/feed";
import { CommentInterface } from "../../interface/comments";
import { customToast } from "../../utils/toast";
import { profileHead } from "./profileHead";
import { editProfile } from "./editProfile";
import { PostElement } from "../feed/postElement";
import { editProfileBodySchema, validate } from "../../schema/job";
import { CreatePost } from "./createPost";
class ProfileManager {
  private postIds: string[] = [];
  private posts: PostInterface[] = [];
  private comments: CommentInterface[] = [];
  private profileHeadSection!: HTMLDivElement;
  private profileFeedSection!: HTMLDivElement;
  private profileEditModalContainer!: HTMLDivElement;
  profileDetails!: ProfileDetailsInterface;

  constructor() {
    this.init();
    this.profileFeedSection = document.querySelector(
      "#profile-feed-container",
    )!;
    this.profileHeadSection = document.querySelector("#profile-head")!;

    this.addPhotoChangeListeners(this.profileHeadSection, myDetails.myId!);
    // this.fetchUserDetails();
  }

  private async init() {
    await this.fetchUserDetails();
    this.createProfileHead();
    this.createEditProfileModal();
    await this.renderFeed();
  }

  private async fetchUserDetails() {
    try {
      const response = await axios.get(`${serverUrl}/profile`, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      });
      if (!response) {
        throw new Error("Unavailable");
      }
      this.profileDetails = response.data[0];
    } catch (error) {
      return;
    }
  }

  private addPhotoChangeListeners(
    profileSection: HTMLElement,
    userId: string,
  ): void {
    console.log(`came to add photo change`);

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
    this.profileHeadSection.innerHTML = profileHead(this.profileDetails);
  }

  createEditProfileModal() {
    this.profileEditModalContainer = document.createElement("div");
    this.profileEditModalContainer.className =
      "fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center hidden";
    this.profileEditModalContainer.id = "create-job-modal";
    this.profileEditModalContainer.innerHTML = /*HTML*/ editProfile(
      this.profileDetails,
    );

    document.body.appendChild(this.profileEditModalContainer);
  }

  private showJobModal() {
    this.profileEditModalContainer.classList.remove("hidden");
  }

  private resetInitialField() {
    const editForm = document.querySelector(
      "#edit-profile-form",
    ) as HTMLFormElement;
    editForm.reset();

    // Hide all error messages
    const errorMessages = editForm.querySelectorAll(".edit-profile-errors");
    errorMessages.forEach((errorMessage) => {
      (errorMessage as HTMLElement).style.display = "none";
    });
  }

  private hideJobModal(tag: string) {
    if (tag === "close") {
      this.resetInitialField();
    }
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

    if (!this.profileEditModalContainer) {
      return;
    }
    this.profileEditModalContainer.addEventListener("click", (e) => {
      if (e.target === this.profileEditModalContainer) {
        this.hideJobModal("close");
      }
    });

    const closeButton = this.profileEditModalContainer.querySelector(
      "[data-close-button]",
    );

    if (closeButton) {
      closeButton.addEventListener("click", () => this.hideJobModal("close"));
    }

    const submitButton = document.querySelector("#submitButton");

    submitButton?.addEventListener("click", () => this.submitEditedProfile());
  }

  private async submitEditedProfile(): Promise<void> {
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
    const editForm = document.getElementById(
      "edit-form-form",
    ) as HTMLFormElement;

    const profileData = {
      headline,
      summary,
      industry,
      experience,
      currentCompany,
      currentPosition,
    };

    const { errors } = validate(editProfileBodySchema, profileData);

    errors?.forEach((error) => {
      const errorElement = document.querySelector(
        `#${error.error}-error`,
      ) as HTMLElement;
      errorElement!.innerHTML = error.message;
      errorElement.style.fontFamily = "font-primary";
    });

    if (errors) {
      return;
    }
    //submit the data
    try {
      const response = await axios.patch(
        `${serverUrl}/profile/update`,
        profileData,
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        },
      );
      customToast(`${response.data}`);
      if (response.status == 200) {
        this.profileDetails = { ...this.profileDetails, ...profileData };
        this.createProfileHead();
        this.hideJobModal("close");
      }
    } catch (error) {}
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
    postElement.innerHTML = CreatePost(post, this.profileDetails);
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

  profileManager.attachButtonListeners();
});
