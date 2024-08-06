export const jobSideBar = () => {
  return /*HTML*/ `
  <div id="job-sidebar"
        class="shadow-blue-gray-900/5 relative flex h-[calc(100vh-2rem)]  flex-col  bg-white bg-clip-border p-4 text-black shadow-xl border-2 border-gray-300 rounded-3xl m-2">
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
              class=" select-none rounded-lg  py-3 px-6 text-center align-middle font-primary text-xs font-bold uppercase text-white shadow-lg shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-100 disabled:shadow-none bg-primary w-9/12"
              type="button"
              
            >
              Create Jobs
            </button>
          </div>
        </nav>







              <div class="container mx-auto p-4 mt-4">
              <div class="mb-2">
              <h5
                class="text-blue-gray-900 block text-xl font-semibold leading-snug tracking-normal antialiased font-primary"
              >
                JobSection
              </h5>
            </div>
              <form id="job-filters" class="space-y-4">
                <!-- Category -->
                <div>
                  <label for="categoryType" class="block text-sm font-medium text-gray-700 font-primary">Category</label>
                  <select id="category" name="categoryType" class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary">
                    <option value="Engineering and Technology">Engineering and Technology</option>
                    <option value="Administrative and Office Support">Administrative and Office Support</option>

                    <option value="Education and Training">Education and Training</option>

                    <option value="Finance and Accounting">Finance and Accounting</option>

                    <option value="Sales and Marketing">Sales and Marketing</option>

                    <option value="Legal and Compliance">Legal and Compliance</option>
                    <option value="Science and Research">Science and Research</option>
                  </select>
                </div>
            
                <!-- Location -->
                <div>
                  <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
                  <input type="text" id="location" name="location" placeholder="Enter location" class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary">
                </div>
            
                <!-- Salary Range -->
                <div>
                  <label for="salary" class="block text-sm font-medium text-gray-700 font-primary">Salary Range</label>
                  <select id="salary" name="salary" class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary>
                    <option value="">Any Salary</option>
                    <option value="0-20000">0 - 20,000</option>
                    <option value="20000 - 100000">20,000 - 100,000</option>
                    <option value="100000">100,000+</option>
                  </select>
                </div>
            
                <!-- Employment Type -->
                <div>
                  <fieldset>
                    <legend class="text-sm font-medium text-gray-700 font-primary">Employment Type</legend>
                    <div class="mt-2 space-y-2">
                      <div class="flex items-center">
                        <input id="full-time" name="employment_type" type="checkbox" value="full-time" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded font-primary">
                        <label for="full-time" class="ml-2 text-sm text-gray-700 font-primary">Full-time</label>
                      </div>

                      <div class="flex items-center">
                        <input id="part-time" name="employment_type" type="checkbox" value="part-time" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                        <label for="part-time" class="ml-2 text-sm text-gray-700 font-primary">Part-time</label>
                      </div>
                    </div>
                  </fieldset>
                </div>
            
                <!-- experienceLevel -->
                <div>
                <label for="experienceLevel" class="block text-sm font-medium text-gray-700 font-primary">Experience Level</label>
                <select id="experienceLevel" name="experienceLevel" class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary">
                  <option value="Intern">Intern</option>
                  <option value="Junior">Junior</option>

                  <option value="Associate">Associate</option>

                  <option value="Senior Level">Senior Level</option>

                  <option value="Team Lead">Team Lead</option>
                </select>
              </div>
            
                <!-- Submit Button -->
                <div>
                  <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Apply Filters
                  </button>
                </div>
              </form>
            </div>
      </div>;
    `;
};
