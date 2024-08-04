import { ProfileDetailsInterface } from "../../interface/profileInterface";

export const editProfile = (profileDetails: ProfileDetailsInterface) => {
  return /*HTML*/ `<div class="bg-white p-6 rounded-lg w-full max-w-md h-[70vh] overflow-scroll hide-scrollbar">
    <h2 class="text-2xl font-bold mb-4 font-primary">Edit Profile</h2>
    <form id="edit-profile-form">
      <!-- Add your form fields here -->
     
          <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2 font-primary" for="headline">
            headline
          </label>
          <textarea class="input-field shadow appearance-none border-2 rounded w-full py-2 text-black leading-tight focus:outline-none focus:shadow-outline font-primary" id="headline"  type="text" rows="2">${profileDetails.headline !== null ? profileDetails.headline : ""}</textarea>
         
            <span id="headline-error" class="edit-profile-errors text-red-500 text-xs italic font-primary"></span>
        </div>

        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2 font-primary" for="summary">
            Summary
          </label>
          <input class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary" id="summary" type="text" placeholder="summary" value="${profileDetails.summary !== null ? profileDetails.summary : ""}">

          <span id="summary-error" class="edit-profile-errors text-red-500 text-xs italic font-primary"></span>
        </div>
     

      <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2 font-primary text-sm" for="Industry">
            Industry
          </label>
          <select 
            class="shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary" 
            id="Industry"
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

      <label class="block text-gray-700 text-sm font-bold mb-2 font-primary" for="experience">
        Experience
      </label>

      <input class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary" id="Experience" type="text" placeholder="Experience" value="${profileDetails.experience !== null ? profileDetails.experience : ""}">

      <span id="experience-error" class="edit-profile-errors text-red-500 text-xs italic font-primary"></span>

    </div>

    <div class="mb-4">

    <label class="block text-gray-700 text-sm font-bold mb-2 font-primary" for="currentCompany">
      current company
    </label>

    <input class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary" id="CurrentCompany" type="text" placeholder="current company" value="${profileDetails.currentCompany !== null ? profileDetails.currentCompany : ""}">

    <span id="currentCompany-error" class="edit-profile-errors text-red-500 text-xs italic font-primary"></span>

  </div>


  <div class="mb-4">

  <label class="block text-gray-700 text-sm font-bold mb-2 font-primary" for="currentCompany">
    current position
  </label>

  <input class="input-field shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-primary" id="CurrentPosition" type="text" placeholder="current position" value="${profileDetails.currentPosition !== null ? profileDetails.currentPosition : ""}">

  <span id="currentPosition-error" class="edit-profile-errors text-red-500 text-xs italic font-primary"></span>

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
  </div>`;
};
