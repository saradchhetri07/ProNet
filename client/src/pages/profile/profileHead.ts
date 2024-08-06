import { myDetails } from "../../constants/constant";
import { ProfileDetailsInterface } from "../../interface/profileInterface";

export const profileHead = (profileDetails: ProfileDetailsInterface) => {
  if (myDetails.myName.startsWith('"') && myDetails.myName.endsWith('"')) {
    myDetails.myName = myDetails.myName.substring(
      1,
      myDetails.myName.length - 1,
    );
  }

  return /*HTML*/ `
          <div class="profile-section max-w-2xl mt-2 mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">

            <div class="cover-photo h-48 bg-gray-300 relative cursor-pointer">
                <img src=${myDetails.myCoverPhotoUrl} alt="Cover Photo" class="w-full h-full object-cover">
                <input type="file" id="cover-photo-input" class="hidden" accept="image/*" name="coverPhoto">
            
            <div class="absolute bottom-0 left-8 transform translate-y-1/2 cursor-pointer">
              <img src=${myDetails.myProfilePhotoUrl} alt=${myDetails.myName}'s photo" class="w-32 h-32 rounded-full border-4 border-white">
              <input type="file" id="profile-photo-input" class="hidden" accept="image/*" name="profilePhoto">
            </div>

      </div>

    <!-- User Info and Buttons -->
    <div class="p-4 pt-20 sm:p-6 sm:pt-20">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">${myDetails.myName}</h1>
          <p class="text-gray-600">${profileDetails.headline !== null ? profileDetails.headline : ""}</p>
          <p class="text-sm text-gray-500 mt-1">${profileDetails.currentCompany !== null ? profileDetails.currentCompany : ""}</p>
        </div>
        <div>
          <button id="edit-profile" class="bg-primary text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300 font-primary">Edit Profile</button>
        </div>
      </div>

      <!-- Additional User Info -->
      <div class="mt-4">
        <p class="text-gray-700">${profileDetails.summary !== null ? profileDetails.summary : ""}</p>
      </div>

      <!-- Experience, Education, etc. can be added here -->

    </div>
  </div>`;
};
