export class Navbar {
  private containerId: string;
  private navbarHtml: string;

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
            <input type="text" placeholder="Search"
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

        </div>
         </nav>
      `;
  }

  public render() {
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = this.navbarHtml;
    } else {
      console.error(`Container with id "${this.containerId}" not found.`);
    }
  }

  public highlightActivePage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      const page = link.getAttribute("data-page");

      if (page && currentPath.includes(page)) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
}
