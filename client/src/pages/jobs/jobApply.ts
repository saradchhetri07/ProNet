import { Job } from "../../interface/job";

export const jobApplyModal = (job: Job) => {
  console.log(job);

  return /*HTML*/ `
  <div class="bg-white p-6 rounded-lg w-full max-w-md">
  <h2 class="text-2xl font-bold mb-4 font-primary">Apply Job</h2>
  <form id="job-application-form" onsubmit="return false;">
    <!-- Add your form fields here -->
    <div class = "flex gap-2">
        <div class="mb-4">
        <h2 class="text-2xl font-bold mb-4 font-primary">Description</h2>
        <p>
        ${job.description !== undefined ? job.description : "No Description for the job"}
        </p>
      </div>
    </div>
   

    <div class = "flex gap-2">
                <div class="mb-4">
                <h2 class="text-2xl font-bold mb-4 font-primary">Title</h2>
                <p>
                ${job.title !== undefined ? job.title : "No title for the job"}
                </p>
            </div>
    </div>


    <div class="mb-4">
                <div class="mb-4">
                <h2 class="text-2xl font-bold mb-4 font-primary">Salary</h2>
                <p>
                ${job.salary !== undefined ? job.salary : "No salary disclosed for the job"}
                </p>
                </div>
    </div>

    <div class="mb-4">
            <div class="mb-4">
            <h2 class="text-2xl font-bold mb-4 font-primary">Experience Level</h2>
            <p>
            ${job.experienceLevel !== undefined && job.experienceLevel !== null ? job.experienceLevel : "No experience disclosed"}
            </p>

            <label for="resume" class="block text-xl font-bold mb-4 font-primary text-gray-700">Upload Resume (PDF only):</label>
            <div class="flex items-center">
                <label class="w-32 flex flex-col items-center px-4 py-6 bg-white text--gray-700 rounded-lg shadow-lg  border border-blue cursor-pointer hover:bg-primary hover:text-white">
                <svg class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M16.707 4.293l-3.388-3.388A1 1 0 0012.586 0H6a2 2 0 00-2 2v16a2 2 0 002 2h8a2 2 0 002-2V5.414a1 1 0 00-.293-.707zM14 16H6v-2h8v2zm0-4H6v-2h8v2zm-2-6V2.414L13.586 4H12z"></path>
                </svg>
                <input type="file" id="resume" name="resume" accept=".pdf" class="hidden" required>
                </label>

            </div>
            </div>


    </div>

  
    <!-- Add more form fields as needed -->
    <div class="flex items-center justify-between">
      <button class="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
      font-primary
      " type="button"
      id="job-apply-submit-Btn"
      >
        Submit
      </button>
      <button class="job-apply-close-btn bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline font-primary" type="button" id='job-apply-close-btn'>
        Close
      </button>
    </div>
  </form>
</div>`;
};
