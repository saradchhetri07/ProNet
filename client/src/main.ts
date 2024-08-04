// src/main.ts

import axios from "axios";
import { accessToken } from "./constants/constant";
import { serverUrl } from "./constants/constant";

class App {
  constructor() {
    console.log("initialized app");
    this.init();
  }

  private async init() {
    if (this.isTokenValid()) {
      await this.verifyToken();
    } else {
      this.redirectToHome();
    }
  }

  private isTokenValid(): boolean {
    return !!accessToken; // Returns true if token exists, false otherwise
  }

  private async verifyToken() {
    try {
      const response = await axios.get(`${serverUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(`gotten response is`, response.data);

      if (response.status == 200) {
        localStorage.setItem("me", JSON.stringify(response.data));
        this.redirectToFeed();
      } else {
        this.redirectToHome();
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      this.redirectToHome();
    }
  }

  private redirectToFeed() {
    window.location.href = "http://localhost:5173/src/pages/feed/feed.html";
  }

  private redirectToHome() {
    window.location.href = "http://localhost:5173/src/pages/home/home.html";
  }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
