import { Navbar } from "../../components/navbar";
import axios from "axios";
import { accessToken, myDetails, serverUrl } from "../../constants/constant";
import { validate, zodBodySchema } from "../../schema/job";
import { convertToDate } from "../../utils/validateDate";
import { Job } from "../../interface/job";
import { customToast } from "../../utils/toast";
import { jobSideBar } from "./jobSideBar";
import { jobModal } from "./jobModal";
import { jobPost } from "./jobPost";
import { jobApplyModal } from "./jobApply";
import emailjs from "@emailjs/browser";
import { config } from "../../utils/emailjs";

class JobManager {
  private JobContainer!: HTMLDivElement;
  private JobSectionSidebar!: HTMLDivElement;
  private JobSectionMainContainer!: HTMLDivElement;
  private createJobButton!: HTMLButtonElement;
  private JobSectionModalContainer!: HTMLDivElement;
  private submitButton!: HTMLButtonElement;
  private jobFilterSections!: HTMLFormElement;
  private jobLists: Job[] = [];

  private JobPostManager = new JobPostManager();

  constructor(containerId: string) {
    const container = document.getElementById(containerId) as HTMLDivElement;

    this.JobContainer = container;
    this.makeSideBar();
    this.createJobModal();
    this.addEventListener();
  }

  async postJob() {
    const title = (
      this.JobSectionModalContainer.querySelector("#title") as HTMLInputElement
    ).value;
    const location = (
      this.JobSectionModalContainer.querySelector(
        "#location",
      ) as HTMLInputElement
    ).value;

    const salary = (
      this.JobSectionModalContainer.querySelector("#salary") as HTMLInputElement
    ).value;
    const employmentType = (
      this.JobSectionModalContainer.querySelector(
        "#employmentType",
      ) as HTMLInputElement
    ).value;
    const requiredSkills = (
      this.JobSectionModalContainer.querySelector(
        "#requiredSkills",
      ) as HTMLTextAreaElement
    ).value;
    const categoryType = (
      this.JobSectionModalContainer.querySelector(
        "#category",
      ) as HTMLTextAreaElement
    ).value;
    const experienceLevel = (
      this.JobSectionModalContainer.querySelector(
        "#experienceLevel",
      ) as HTMLInputElement
    ).value;
    const applicationDeadline = (
      this.JobSectionModalContainer.querySelector(
        "#applicationDeadline",
      ) as HTMLInputElement
    ).value as any;
    const descriptions = (
      this.JobSectionModalContainer.querySelector(
        "#descriptions",
      ) as HTMLTextAreaElement
    ).value;

    // Create the data object
    let jobData = {
      title,
      location,
      salary: parseInt(salary, 10),
      employmentType,
      requiredSkills,
      categoryType,
      experienceLevel,
      applicationDeadline,
      description: descriptions,
    };

    //clear if any existing error is preset

    this.clearExisitingErrors();

    // Validate the data
    const { errors } = validate(zodBodySchema, jobData);

    errors?.forEach((error) => {
      console.log(`error is`, error);

      const errorElement = this.JobSectionModalContainer.querySelector(
        `#${error.error}-error`,
      ) as HTMLElement;

      errorElement!.innerHTML = error.message;
      errorElement.style.fontFamily = "font-primary";
    });

    jobData.applicationDeadline = convertToDate(applicationDeadline);

    if (errors) {
      return;
    }

    console.log(`job data is`, jobData);

    try {
      const response = await axios.post(`${serverUrl}/jobs`, jobData, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        customToast(response.data.message);
        this.hideJobModal();
      }
    } catch (error: any) {
      console.log(`error form database is`, error);

      customToast(error.response.message);
    }
  }

  private clearExisitingErrors() {
    const errors =
      this.JobSectionModalContainer.querySelectorAll(`.post-error`);

    errors.forEach((error) => {
      error!.innerHTML = "";
    });
  }

  private addEventListener() {
    const submitBtn =
      this.JobSectionModalContainer.querySelector("#submitButton");

    if (submitBtn) {
      submitBtn!.addEventListener("click", () => this.postJob());
    }

    this.createJobButton = document.getElementById(
      "create-jobs",
    ) as HTMLButtonElement;

    if (!this.createJobButton) {
      return;
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

    //filter job section
    document
      .getElementById("job-filters")!
      .addEventListener("submit", () => this.handleJobFilterSection(event!));
  }

  private handleJobFilterSection(e: Event) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Convert employment_type checkboxes to array
    const employmentType = formData.getAll("employment_type");
    formData.delete("employmentType");
    formData.append("employmentType", employmentType.join(","));

    // Convert skills to array

    const experienceLevel = formData.get("experienceLevel");
    formData.delete("experienceLevel");
    formData.append("experienceLevel", experienceLevel!);

    const Salary = formData.get("salary");
    formData.append("salary", Salary!);

    const Location = formData.get("location");
    formData.append("location", Location!);

    const queryParams = new URLSearchParams({
      categoryType: formData.get("categoryType") as string,
      location: Location as string,
      salary: formData.get("salary") as string,
      employmentType: formData.get("employmentType") as string,
      experienceLevel: formData.get("experienceLevel") as string,
    });
    this.postJobFilter(queryParams.toString());
  }

  private async postJobFilter(params: string) {
    try {
      console.log(
        `form data at postjob filter`,
        `${serverUrl}/jobs/filter?${params}`,
      );

      const response = await axios.get(`${serverUrl}/jobs/filter?${params}`, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
          "Content-Type": "application/json",
        },
      });

      this.jobLists = response.data;
      this.JobPostManager.setJobByFilter(this.jobLists);
      this.JobPostManager.createJobList();
    } catch (error: any) {
      customToast("Loading");
    }
  }

  private createJobModal() {
    this.JobSectionModalContainer = document.createElement("div");
    this.JobSectionModalContainer.className =
      "fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center hidden";
    this.JobSectionModalContainer.id = "job-modal";

    this.JobSectionModalContainer.innerHTML = jobModal();

    document.body.appendChild(this.JobSectionModalContainer);
  }

  private showJobModal() {
    this.JobSectionModalContainer.classList.remove("hidden");
  }

  private hideJobModal() {
    //this.resetInitialField();
    this.JobSectionModalContainer.classList.add("hidden");
    const formElement = this.JobSectionModalContainer.querySelector(
      "#job-modal-form",
    ) as HTMLFormElement;
    formElement.reset();
    this.clearExisitingErrors();
  }

  private makeSideBar() {
    this.JobSectionSidebar = document.getElementById(
      "jobs-section__sidebar",
    ) as HTMLDivElement;

    if (this.JobContainer) {
      this.JobContainer.innerHTML = jobSideBar();
    }
  }
}

export class JobPostManager {
  private jobSectionMainContainer!: HTMLDivElement;
  private jobSectionFilter!: HTMLDivElement;
  private jobSectionJobList!: HTMLDivElement;
  private jobApplyModal!: HTMLDivElement;
  private jobLists: Job[] = [];
  val: number = 1;

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
    this.jobApplyModal = document.createElement("div");
    this.init();
  }

  private async init() {
    await this.fetchJobList();
    this.createJobList();
  }

  getSearchResult(title: string) {
    this.setJobBySearch(title);
  }

  async setJobBySearch(query: string) {
    try {
      const queryParams = new URLSearchParams({
        title: query,
      });
      console.log(`params is`, queryParams);

      console.log(`${serverUrl}/jobs/search?${queryParams.toString()}`);

      const response = await axios(
        `${serverUrl}/jobs/search?${queryParams.toString()}`,
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
            "Content-Type": "application/json",
          },
        },
      );

      this.jobLists = response.data;
      this.createJobList();
    } catch (error) {
      customToast("error occured");
    }
  }
  setJobByFilter(jobList: Job[]) {
    this.jobLists = jobList;
  }

  private async fetchJobList() {
    try {
      const response = await axios.get(`${serverUrl}/jobs`, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      });
      this.jobLists = response.data;
    } catch (error) {
      throw Error("failed to fetch error");
    }
  }

  private createJobApplyModal(job: Job) {
    this.jobApplyModal.className =
      "fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center hidden";
    this.jobApplyModal.id = "job-apply-modal";
    this.jobApplyModal.innerHTML = jobApplyModal(job);

    document.body.appendChild(this.jobApplyModal);
  }

  showJobModal(e: Event) {
    console.log(`came to show job modal`);

    const target = e.target as HTMLButtonElement;
    let job;
    if (target.classList.contains("job-apply-btn")) {
      const button = target.closest(".job-apply-btn") as HTMLButtonElement;
      const jobId = button.dataset.jobId;
      const buttonId = button.id;

      job = this.jobLists.find((job) => {
        return job.jobsTableId == parseInt(jobId!);
      });
    }

    this.createJobApplyModal(job!);

    this.jobApplyModal.classList.remove("hidden");

    //close the modal if close button clicked
    this.jobApplyModal
      .querySelector("#job-apply-close-btn")!
      .addEventListener("click", (event) => {
        //close the modal
        this.jobApplyModal.classList.add("hidden");
      });

    //submit the form
    this.handleJobSumitForm(job!);
  }

  async handleJobSumitForm(job: Job) {
    const form = document.getElementById(
      "job-application-form",
    ) as HTMLFormElement;

    form.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent default form submission

      // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS service and template IDs
      console.log(event);

      emailjs.sendForm(config.serviceId, config.templateId, form).then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
        },
        (error) => {
          console.error("FAILED...", error);
        },
      );
    });

    const submitBtn = this.jobApplyModal.querySelector(
      "#job-apply-submit-Btn",
    ) as HTMLButtonElement;

    const fileInput = this.jobApplyModal.querySelector(
      "#resume",
    ) as HTMLInputElement;

    submitBtn!.addEventListener("click", async () => {
      const file = fileInput.files ? fileInput.files[0] : null;

      console.log(`file selected`, file);

      if (!file) {
        customToast("please select pdf");
        return;
      }
      try {
        let base64File = await this.convertToBase64(file);

        const templateParams = {
          from_name: myDetails.myName,
          to_email: job.email, // Replace with the actual recipient email
          job_title: job.title,
          job_description: job.description,
          job_salary: job.salary,
          job_experience: job.experienceLevel,
        };

        const response = await emailjs.send(
          config.serviceId,
          config.templateId,
          templateParams,
        );

        customToast("Your application has been submitted successfully!");
        form.reset();
        this.hideJobModal();
      } catch (error: any) {
        console.error("FAILED...", error);
        customToast(error.text);
      }
    });
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64Content = base64String.split(",")[1];
        resolve(base64Content);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  hideJobModal() {
    //this.resetInitialField();
    this.jobApplyModal.classList.add("hidden");
  }

  createJobList() {
    if (!this.jobSectionJobList) {
      return;
    }
    this.jobSectionJobList.innerHTML = "";

    this.jobLists.forEach((job, index) => {
      const jobPost = document.createElement("div");
      jobPost.innerHTML = this.createJobPost(job, index);
      jobPost.classList.add("w-4/5");

      this.jobSectionJobList.appendChild(jobPost);
    });
    const deleteBtn =
      this.jobSectionJobList.querySelectorAll(".delete-job-btn");

    deleteBtn.forEach((btn) => {
      const jobId = btn.getAttribute("data-job-id");
      console.log(`jobId is`, jobId);
      btn.addEventListener("click", () => this.deleteJob(jobId!));
    });
  }

  private async deleteJob(jobId: string) {
    try {
      const response = await axios.delete(`${serverUrl}/jobs/del/${jobId}`, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      });
      if (response.status == 200) {
        customToast(response.data.message);
      }
      this.jobLists = this.jobLists.filter(
        (job) => job.jobsTableId != parseInt(jobId),
      );
      this.createJobList();
    } catch (error: any) {
      customToast(error.response.message.data);
    }
  }

  private createJobPost(job: Job, index: number): string {
    return jobPost(job, index);
  }
  getJobSectionJobList(): HTMLDivElement {
    return this.jobSectionJobList;
  }

  getJobApplyModal(): HTMLDivElement {
    return this.jobApplyModal;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const navbar = new Navbar("navbar-container");
  navbar.render();
  navbar.highlightActivePage();

  //init email js
  emailjs.init(config.userId);

  const jobPostManager = new JobPostManager();

  if (jobPostManager.getJobSectionJobList()) {
    jobPostManager.getJobSectionJobList().addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.closest(".job-apply-btn")) {
        jobPostManager.showJobModal(event);
      }
    });
  }

  jobPostManager.getJobApplyModal().addEventListener("click", (event) => {
    if (event.target === jobPostManager.getJobApplyModal()) {
      jobPostManager.hideJobModal();
    }
  });

  const jobManager = new JobManager("jobs-section__sidebar");
});
