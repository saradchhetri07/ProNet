export const jobModal = () => {
  return /*HTML*/ `<div class="bg-white p-6 rounded-lg w-full max-w-md">
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
};
