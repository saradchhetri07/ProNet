import { Navbar } from "../../components/navbar";
import axios from "axios";
import { accessToken, serverUrl } from "../../constants/constant";
import { validate, zodBodySchema } from "../../schema/job";
import { convertToDate } from "../../utils/validateDate";
import { Job } from "../../interface/job";

class JobManager {
  private JobContainer!: HTMLDivElement;
  private JobSectionSidebar!: HTMLDivElement;
  private JobSectionMainContainer!: HTMLDivElement;
  private createJobButton!: HTMLButtonElement;
  private JobSectionModalContainer!: HTMLDivElement;
  private submitButton!: HTMLButtonElement;

  constructor(containerId: string) {
    const container = document.getElementById(containerId) as HTMLDivElement;

    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.JobContainer = container;
    this.makeSideBar();
    this.createJobModal();
    this.addEventListener();
  }

  async postJob() {
    const title = (document.getElementById("title") as HTMLInputElement).value;
    const location = (document.getElementById("location") as HTMLInputElement)
      .value;

    const salary = (document.getElementById("salary") as HTMLInputElement)
      .value;
    const employmentType = (
      document.getElementById("employmentType") as HTMLInputElement
    ).value;
    const requiredSkills = (
      document.getElementById("requiredSkills") as HTMLTextAreaElement
    ).value;
    const categoryType = (
      document.getElementById("category") as HTMLTextAreaElement
    ).value;
    const experienceLevel = (
      document.getElementById("experienceLevel") as HTMLInputElement
    ).value;
    const applicationDeadline = (
      document.getElementById("applicationDeadline") as HTMLInputElement
    ).value as any;
    const descriptions = (
      document.getElementById("descriptions") as HTMLTextAreaElement
    ).value;
    // console.log(`title is`, title);

    // Create the data object
    const jobData = {
      title,
      location,
      salary,
      employmentType,
      requiredSkills,
      categoryType,
      experienceLevel,
      applicationDeadline,
      descriptions,
    };
    jobData.applicationDeadline = convertToDate(applicationDeadline);

    console.log(`jodata looks like`, jobData);

    // Validate the data
    const { errors } = validate(zodBodySchema, jobData);

    errors?.forEach((error) => {
      console.log(`error from zod`, error);
      const errorElement = document.querySelector(
        `#${error.error}-error`,
      ) as HTMLElement;
      errorElement!.innerHTML = error.message;
      errorElement.style.fontFamily = "font-primary";
    });

    if (errors) {
      return;
    }

    try {
      const response = await axios.post(`${serverUrl}/jobs`, jobData, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
          "Content-Type": "application/json",
        },
      });
      console.log(`gotten response is`, response);
    } catch (err) {
      console.log("error is", err);
      throw new Error(`Error posting job`);
    }
  }

  private addEventListener() {
    this.submitButton = document.getElementById(
      "submitButton",
    ) as HTMLButtonElement;

    this.submitButton.addEventListener("click", () => this.postJob());

    this.createJobButton = document.getElementById(
      "create-jobs",
    ) as HTMLButtonElement;
    if (!this.createJobButton) {
      throw new Error(`Button with id create-jobs not found`);
    }
    this.createJobButton.addEventListener("click", () => this.showJobModal());

    // Add event listener to close the modal when clicking outside
    this.JobSectionModalContainer.addEventListener("click", (e) => {
      if (e.target === this.JobSectionModalContainer) {
        this.hideJobModal();
      }
    });

    // Add event listener to close button if it exists
    const closeButton = this.JobSectionModalContainer.querySelector(
      "[data-close-button]",
    );
    if (closeButton) {
      closeButton.addEventListener("click", () => this.hideJobModal());
    }
  }

  private createJobModal() {
    this.JobSectionModalContainer = document.createElement("div");
    this.JobSectionModalContainer.className =
      "fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center hidden";
    this.JobSectionModalContainer.id = "job-modal";

    this.JobSectionModalContainer.innerHTML = /*html*/ `
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4 font-primary">Create New Job</h2>
        <form>
          <!-- Add your form fields here -->
          <div class = "flex gap-2">
              <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2 font-primary" for="title">
                Title
              </label>
              <input class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary" id="title" type="text" placeholder="Job Title">
              
                <span id="title-error" class="post-error text-red-500 text-xs italic font-primary"></span>

            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2 font-primary" for="location">
                Location
              </label>
              <input class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary" id="location" type="text" placeholder="Location">

              <span id="location-error" class="post-error text-red-500 text-xs italic font-primary"></span>
            </div>
          </div>
         

          <div class = "flex gap-2">
              <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2 font-primary" for="salary">
                Salary
              </label>
              <input class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary" id="salary" type="text" placeholder="Salary">
             
            </div>

            <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2 font-primary text-sm" for="employmentType">
                    Employment Type
                  </label>
                  <select 
                    class="shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary" 
                    id="employmentType"
                  >
                    <option value="Full-time">Full Time</option>
                    <option value="Part-time">Part Time</option>

                  </select>
            </div>
            
          </div>
          <span id="salary-error" class="post-error text-red-500 text-xs italic font-primary error"></span>

          <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2 font-primary text-sm" for="categoryType">
            Job Category
          </label>
          <select 
            class="shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary" 
            id="category"
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
  <label class="block text-gray-700 text-sm font-bold mb-2 font-primary" for="requiredSkills">
    Required Skills
  </label>
  <textarea 
    class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary"
    id="requiredSkills"
    placeholder="Required Skills"
    rows="2" 
  ></textarea>
  <span id="requiredSkills-error" class="post-error error text-red-500 text-xs italic font-primary"></span>
</div>

          <div class="mb-4">

          <label class="block text-gray-700 text-sm font-bold mb-2 font-primary" for="experienceLevel">
            Experience Level
          </label>

          <input class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary" id="experienceLevel" type="text" placeholder="Experience Level">

          <span id="experienceLevel-error" class="error text-red-500 text-xs italic font-primary"></span>

        </div>

        <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2 font-primary" for="applicationDeadline">
          Application Deadline
        </label>
        <input class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary" id="applicationDeadline" type="text" placeholder="Enter date in YYYY-MM-DD format">
        <span id="applicationDeadline-error" class="post-error text-red-500 text-xs italic font-primary error"></span>
      </div>


      <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2 font-primary" for="descriptions">
        Descriptions
      </label>
      <textarea 
        class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary"
        id="descriptions"
        placeholder="Descriptions"
        name="descriptions"
        rows="4" 
      ></textarea>
      <span id="descriptions-error" class="post-error text-red-500 text-xs italic font-primary error"></span>
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
      </div>
    `;

    document.body.appendChild(this.JobSectionModalContainer);
  }

  private showJobModal() {
    this.JobSectionModalContainer.classList.remove("hidden");
  }

  private hideJobModal() {
    //this.resetInitialField();
    this.JobSectionModalContainer.classList.add("hidden");
  }

  private resetInitialField() {
    (document.getElementById("title") as HTMLInputElement).value = "";
    (document.getElementById("location") as HTMLInputElement).value = "";
    (document.getElementById("salary") as HTMLInputElement).value = "";
    (document.getElementById("employmentType") as HTMLInputElement).value = "";
    (document.getElementById("requiredSkills") as HTMLTextAreaElement).value =
      "";
    (document.getElementById("experienceLevel") as HTMLInputElement).value = "";
    (document.getElementById("applicationDeadline") as HTMLInputElement).value =
      "";
    (document.getElementById("descriptions") as HTMLTextAreaElement).value = "";
  }
  private makeSideBar() {
    this.JobSectionSidebar = document.getElementById(
      "jobs-section__sidebar",
    ) as HTMLDivElement;

    this.JobContainer.innerHTML = /*html*/ `
          <div
        class="shadow-blue-gray-900/5 relative flex h-[calc(100vh-2rem)] w-full max-w-[20rem] flex-col  bg-white bg-clip-border p-4 text-black shadow-xl border-2 border-gray-300 rounded-3xl m-2"
      >
        <div class="mb-2 p-4">
          <h5
            class="text-blue-gray-900 block text-xl font-semibold leading-snug tracking-normal antialiased font-primary"
          >
            JobSection
          </h5>
        </div>
        <nav
          class="text-blue-gray-700 flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal"
        >
          <!-- Existing Sidebar Content -->
          <!-- ... -->

          <!-- New Buttons -->
          <div class="flex flex-col gap-2 mt-4">
            <button id = "create-jobs"
              class=" select-none rounded-lg  py-3 px-6 text-center align-middle font-primary text-xs font-bold uppercase text-white shadow-lg shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-100 disabled:shadow-none bg-primary"
              type="button"
              
            >
              Create Jobs
            </button>
            <button
              class="select-none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-primary text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              data-dialog-target="button-two-dialog"
            >
              Browse Jobs
            </button>
          </div>
        </nav>
      </div>
`;
  }

  //create list of jobs
}

class JobPostManager {
  private jobSectionMainContainer!: HTMLDivElement;
  private jobSectionFilter!: HTMLDivElement;
  private jobSectionJobList!: HTMLDivElement;
  private jobLists: Job[] = [];

  constructor() {
    this.jobSectionMainContainer = document.querySelector(
      "#jobs-section__maincontainer",
    ) as HTMLDivElement;
    this.jobSectionFilter = document.querySelector(
      "#jobs-section__filter",
    ) as HTMLDivElement;
    this.jobSectionJobList = document.querySelector(
      "#jobs-section__joblist",
    ) as HTMLDivElement;

    this.createJobFilter();
    this.init();
    this.addEventListener();
  }

  private async init() {
    try {
      await this.fetchJobList();
      this.createJobList();
    } catch (error) {
      console.error("Error initializing JobPostManager:", error);
    }
  }

  private async fetchJobList() {
    console.log(`came to fetch the list`);

    try {
      const response = await axios.get(`${serverUrl}/jobs`, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      });
      console.log(`gotten response is`, response.data);
      this.jobLists = response.data;
      console.log(`local job list`, this.jobLists);
    } catch (error) {
      throw Error("failed to fetch error");
    }
  }

  private createJobFilter() {}

  private createJobList() {
    this.jobSectionJobList.innerHTML = "";
    console.log(`job is`, this.jobLists);

    this.jobLists.forEach((job, index) => {
      console.log(`each individual job is`, job);

      const jobPost = document.createElement("div");
      jobPost.innerHTML = this.createJobPost(job, index);
      jobPost.classList.add("w-4/5");
      this.jobSectionJobList.appendChild(jobPost);
    });
  }

  private createJobPost(job: Job, index: number): string {
    return /*HTML*/ `
    <div class="flex flex-col items-center justify-center overflow-hidden pt-2 sm:py-10">
 
          <div id="jobContent${index}" class="bg-white shadow-sm w-full max-w-4xl flex flex-col sm:flex-row gap-3 sm:items-center  justify-between px-5 py-4 rounded-3xl">
            <div>
              <span class="text-purple-800 text-sm font-primary">${job.categoryType}</span>
              <h3 class="font-bold mt-px font-primary">${job.title}</h3>
              <div class="flex items-center gap-3 mt-2">
                <span class="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-sm">${job.employmentType}</span>
                <span class="text-slate-600 text-sm flex gap-1 items-center"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>${job.location}</span>
              </div>
            </div>
            <div>
              <button class="bg-black text-white font-medium px-4 py-2 rounded-md flex gap-1 items-center font-primary">Apply Now <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          </svg>
          </button>
            </div>
            </div>
  
    </div>
    `;
  }

  private addEventListener() {}
}

document.addEventListener("DOMContentLoaded", async () => {
  const navbar = new Navbar("navbar-container");
  navbar.render();
  navbar.highlightActivePage();

  const jobManager = new JobManager("jobs-section__sidebar");

  const jobPostManager = new JobPostManager();
});
