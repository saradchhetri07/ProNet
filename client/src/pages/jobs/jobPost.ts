import { Job } from "../../interface/job";

export const jobPost = (job: Job, index: number) => {
  return /*HTML*/ `<div class="flex flex-col items-center justify-center overflow-hidden pt-2 sm:py-10">
 
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
              <button id='job-apply-btn${index}' data-job-id="${job.jobsTableId}" class="job-apply-btn bg-black text-white font-medium px-4 py-2 rounded-md flex gap-1 items-center font-primary">Apply Now <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />

          </svg>
          </svg>
          </button>
            </div>
            </div>
  
    </div>`;
};
