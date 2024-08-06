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
import { removeQuote } from "../../utils/remoteQuote";
import { getCurrentDate } from "../../utils/currentDate";

class ProfileManager {
  private postIds: string[] = [];
  private posts: PostInterface[] = [];
  private comments: CommentInterface[] = [];
  private profileHeadSection!: HTMLDivElement;
  private profileFeedSection!: HTMLDivElement;
  private profileEditModalContainer!: HTMLDivElement;
  profileDetails!: ProfileDetailsInterface;
  profileFound: boolean = true;

  constructor() {
    this.profileFeedSection = document.querySelector(
      "#profile-feed-container",
    )!;
    this.profileHeadSection = document.querySelector("#profile-head")!;
    this.init();

    // this.fetchUserDetails();
  }

  private async init() {
    await this.fetchUserDetails();
    this.createProfileHead();
    this.createEditProfileModal();
    await this.renderFeed();
    await this.fetchComments();
    this.addPhotoChangeListeners(this.profileHeadSection, myDetails.myId!);
  }

  private async fetchUserDetails() {
    try {
      const response = await axios.get(`${serverUrl}/profile`, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      });

      this.profileDetails = response.data[0];
    } catch (error: any) {
      customToast(error.response.data.message);

      if (error.response.status == 404) {
        this.profileFound = false;
        this.profileDetails = {
          currentCompany: "",
          currentPosition: "",
          experience: "",
          headline: "",
          industry: "",
          summary: "",
        };
      }
      this.createEditProfileModal();
    }
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

  private hideJobModal(tag: string) {
    this.profileEditModalContainer.classList.add("hidden");
  }

  async fetchPosts(): Promise<void> {
    try {
      // Configure axios request with headers
      const response = await axios.get(`${serverUrl}/posts/myPosts`, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      });

      if (!response) {
        throw new Error("Network response was not ok");
      }

      this.posts = response.data;
      this.getMyPosts(removeQuote(myDetails.myId!));
      console.log(`my ports are`, this.posts);
    } catch (error: any) {
      customToast(error.response.data.message);
    }
  }

  attachButtonListeners() {
    const likeButtons =
      this.profileFeedSection.querySelectorAll(".like-button");
    likeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const icon = button.querySelector("i");
        const postId = button.getAttribute("data-post-id");
        if (icon) {
          this.toggleLike(icon, postId!);
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

    const inputFields =
      this.profileFeedSection.querySelectorAll(".comment-input");

    inputFields.forEach((input) => {
      const inputElement = input as HTMLInputElement;
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
    });

    // document.addEventListener("click", this.handleDocumentClick.bind(this));

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

    const submitButton =
      this.profileEditModalContainer.querySelector("#submitButton");

    if (submitButton) {
      console.log(`inside submit button`, submitButton);

      submitButton.addEventListener("click", () => {
        this.submitEditedProfile();
      });
    }

    const iFields = document.querySelectorAll(".iFields");
    iFields.forEach((iFields) => {
      iFields.addEventListener("click", (event) => {
        const iPostId = iFields.getAttribute("data-post-id");
        this.handleDocumentClick(event as MouseEvent, iPostId!);
      });
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

  async insertComments(commentData: CommentInterface) {
    try {
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
      customToast(response.data.message);
    } catch (error: any) {
      customToast(error);
    }
  }

  private async submitEditedProfile(): Promise<void> {
    console.log(`came inside submit edit profile`);

    const headline = (
      this.profileEditModalContainer.querySelector(
        "#headline",
      ) as HTMLTextAreaElement
    ).value;
    const summary = (
      this.profileEditModalContainer.querySelector(
        "#summary",
      ) as HTMLInputElement
    ).value;
    const industry = (
      this.profileEditModalContainer.querySelector(
        "#Industry",
      ) as HTMLInputElement
    ).value;
    const experience = (
      this.profileEditModalContainer.querySelector(
        "#Experience",
      ) as HTMLInputElement
    ).value;
    const currentCompany = (
      this.profileEditModalContainer.querySelector(
        "#CurrentCompany",
      ) as HTMLInputElement
    ).value;
    const currentPosition = (
      this.profileEditModalContainer.querySelector(
        "#CurrentPosition",
      ) as HTMLInputElement
    ).value;
    const editForm = this.profileEditModalContainer.querySelector(
      "#edit-form-form",
    ) as HTMLFormElement;

    const profileData = {
      headline,
      summary,
      industry,
      experience,
      currentCompany,
      currentPosition,
    };

    console.log(`profile details is`, profileData);

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
      if (this.profileFound) {
        const response = await axios.patch(
          `${serverUrl}/profile/update`,
          profileData,
          {
            headers: {
              Authorization: accessToken ? `Bearer ${accessToken}` : "",
            },
          },
        );
        console.log(`response from server after updating`, response);

        customToast(`${response.data}`);
        if (response.status == 200) {
          this.profileDetails = { ...this.profileDetails, ...profileData };
          this.createProfileHead();
          this.hideJobModal("close");
        }
      } else {
        const response = await axios.post(
          `${serverUrl}/profile/post`,
          profileData,
          {
            headers: {
              Authorization: accessToken ? `Bearer ${accessToken}` : "",
            },
          },
        );
        customToast(response.data);

        if (response.status == 200) {
          this.profileDetails = { ...this.profileDetails, ...profileData };
          this.createProfileHead();
          this.hideJobModal("close");
        }
      }
    } catch (error: any) {
      customToast(error.response.data.message);
    }
  }

  private handleDocumentClick(event: MouseEvent, postId: string): void {
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

  async toggleLike(likeIcon: HTMLElement, postId: string) {
    likeIcon.classList.toggle("liked");

    const likeCountElement = document.getElementById(`like-count-${postId}`);

    if (likeCountElement) {
      // Extract the current count from the span text content
      let likeCount = parseInt(likeCountElement.textContent!.split(" ")[1], 10);
      console.log(`like count is`, likeCount);

      if (likeIcon.classList.contains("liked")) {
        likeCount += 1;
      } else {
        likeCount -= 1;
      }
      likeCountElement.textContent = `👍❤️ ${likeCount} likes`;
      try {
        const response = await axios.post(
          `${serverUrl}/posts/like/${postId}`,
          {},
          {
            headers: {
              Authorization: accessToken ? `Bearer ${accessToken}` : "",
            },
          },
        );
        customToast(response.data.message);
      } catch (error: any) {
        customToast(error.response.data.message);
      }
    }
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

  async setPostsIds() {
    this.posts.forEach((post) => {
      this.postIds.push(post.postId);
    });
  }

  async renderFeed() {
    await this.fetchPosts();
    this.getMyPosts(removeQuote(myDetails.myId!));
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
      console.log(`gotten post id is ${postId}`);

      const response = await axios.delete(
        `${serverUrl}/posts/delete/${postId}`,
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
            "Content-Type": "application/json", // Optional: specify content type if needed
          },
        },
      );
      if (response.status == 200) {
        customToast(response.data.message);
        this.posts = this.posts.filter((post) => post.postId !== postId);
        setTimeout(() => {
          this.renderFeed();
        }, 2000);
      }
    } catch (error: any) {
      customToast(error.response.statusText);
    }
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
      await this.setPostsIds();

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
