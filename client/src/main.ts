// src/main.ts

import axios from "axios";
import { accessToken } from "./constants/constant";
import { serverUrl } from "./constants/constant";

class App {
  constructor() {
    console.log(`cconssa`);

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
      const response = await axios.get(`${serverUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.valid) {
        console.log("Token verification successful");

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
    window.location.href = "/feed.html";
  }

  private redirectToHome() {
    window.location.href = "http://localhost:5173/src/pages/home/home.html";
  }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
