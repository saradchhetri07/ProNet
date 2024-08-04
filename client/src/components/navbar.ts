import { JobPostManager } from "../pages/jobs/jobs";
import { NetworkManager } from "../pages/network/network";
import { customToast } from "../utils/toast";

export class Navbar {
  private containerId: string;
  private navbarHtml: string;
  private searchInput: HTMLInputElement | null = null;
  private debounceTimeout: ReturnType<typeof setTimeout> | null = null;
  fieldActive: Boolean = false;
  private jobPostManager?: JobPostManager;
  private networkManager?: NetworkManager;

  currentPage!: string;

  constructor(containerId: string) {
    this.containerId = containerId;
    this.navbarHtml = /*HTML*/ `
         <nav class="navbar bg-white shadow-md flex items-center justify-between px-4 py-2">

        <!-- Logo -->
        <a href="/src/pages/feed/feed.html" class="flex items-center space-x-2">
            <strong class="text-blue-600">Pro</strong>
            <strong class="text-blue-400">Net</strong>
        </a>

        <!-- Search Box -->
        <div class="flex-grow mx-4 max-w-lg">
            <input type="text" placeholder="Search" id='navbar-search-box-input'
                class="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 font-primary">
        </div>
        <!-- Icons -->
        <div class="flex items-center space-x-6">
            <a href="/src/pages/feed/feed.html" class="nav-link" data-page="feed">
                <i class="fas fa-home"></i>
                <span class="hidden md:inline font-primary">Home</span>
            </a>
            <a href="/src/pages/network/network.html" class="nav-link" data-page="network">
                <i class="fas fa-network-wired"></i>
                <span class="hidden md:inline font-primary">Network</span>
            </a>
            <a href="/src/pages/jobs/jobs.html" class="nav-link" data-page="jobs">
                <i class="fas fa-briefcase"></i>
                <span class="hidden md:inline font-primary">Jobs</span>
            </a>
            <a href="/src/pages/messages/messages.html" class="nav-link" data-page="messages">
                <i class="fas fa-envelope"></i>
                <span class="hidden md:inline font-primary">Messages</span>
            </a>
            <a href="/src/pages/profile/profile.html" class="nav-link" data-page="profile">
                <i class="fas fa-user-circle text-xl"></i>
                <span class="hidden md:inline font-primary">profile</span>
            </a>
            <a href="/src/pages/home/home.html" class="nav-link" data-page="logout" id="logout-link">
                <i class="fas fa-user-circle text-xl"></i>
                <span class="hidden md:inline font-primary">Log Out</span>
            </a>

        </div>
         </nav>
      `;
  }

  public render() {
    console.log(`rendered page`);

    const container = document.getElementById(
      this.containerId,
    ) as HTMLDivElement;

    console.log(`container is`, container);

    if (container) {
      container.innerHTML = this.navbarHtml;
      this.initializeSearch();
    } else {
      console.error(`Container with id "${this.containerId}" not found.`);
    }
  }

  private initializeSearch(): void {
    console.log(`intialize search`);

    this.searchInput = document.getElementById(
      "navbar-search-box-input",
    ) as HTMLInputElement;

    if (this.searchInput) {
      this.searchInput.addEventListener(
        "input",
        this.debounceSearch.bind(this),
      );
    }
  }

  private debounceSearch(): void {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(() => {
      this.performSearch();
    }, 300); // 300ms delay
  }

  performSearch(): void {
    const searchTerm = this.searchInput?.value.trim();
    console.log(searchTerm);

    if (searchTerm && this.currentPage == "jobs") {
      if (!this.jobPostManager) {
        this.jobPostManager = new JobPostManager();
      }
      this.jobPostManager.getSearchResult(searchTerm);
    }

    if (searchTerm && this.currentPage == "network") {
      // Initialize networkManager only if it's not already initialized
      if (!this.networkManager) {
        this.networkManager = new NetworkManager();
      }
      this.networkManager.getUserSearchResult(searchTerm);
    }
  }

  public highlightActivePage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".nav-link");
    const searchInputElement = document.querySelector(
      'input[placeholder="Search"]',
    ) as HTMLInputElement;
    const searchBar = document.getElementById("navbar-search-box-input");

    navLinks.forEach((link) => {
      const page = link.getAttribute("data-page");

      if (page && currentPath.includes(page)) {
        if (page == "feed") {
          this.currentPage = "feed";
          searchBar?.classList.add("hidden");
        } else if (page == "network") {
          this.currentPage = "network";
          searchInputElement!.placeholder = "Search Connections";
        } else if (page == "jobs") {
          this.currentPage = "jobs";
          searchInputElement!.placeholder = "Search Jobs";
        } else if (page == "profile") {
          this.currentPage = "profile";
          searchInputElement!.placeholder = "Search Jobs";
          searchBar?.classList.add("hidden");
        }
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    const logoutLink = document.getElementById("logout-link");

    logoutLink!.addEventListener("click", function (event) {
      event.preventDefault();

      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      localStorage.removeItem("accessToken");

      customToast("you have been logged out");
      setTimeout(() => {
        window.location.href = "/src/pages/home/home.html";
      }, 2000);
    });
  }
}
