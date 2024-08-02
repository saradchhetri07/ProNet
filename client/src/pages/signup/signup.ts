import { ISignUpForm } from "../../interface/signUpForm";
import { loginUserBodySchema, signUpUserBodySchema } from "../../schema/user";
import axios from "axios";
import Toastify from "toastify-js";

const submitErrorContainer = document.getElementById(
  "submit_error_container",
) as HTMLDivElement;

function previewImage(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files ? input.files[0] : null;

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const preview = document.getElementById("preview") as HTMLImageElement;
      if (e.target && e.target.result) {
        preview.src = e.target.result as string;
      }
    };

    reader.readAsDataURL(file);
  }
}

function handleFormSubmit(event: Event): void {
  event.preventDefault();

  const target = event.target as HTMLFormElement;
  const fileInput = document.getElementById("profilePhoto") as HTMLInputElement;
  const file = fileInput.files ? fileInput.files[0] : null;

  const data = {
    name: target.username.value,
    email: target.email.value,
    password: target.password.value,
  };

  // Validate the data
  const { error } = signUpUserBodySchema.validate(data);
  if (error) {
    console.error(error);
    displayErrors(error.message, submitErrorContainer);
  } else {
    submitSignUpForm(data, file);
  }
}

async function submitSignUpForm(data: ISignUpForm, file: File | null) {
  `Submitting form data...`;
  `File value is`, file;

  // Create a new FormData instance
  const formData = new FormData();

  // Append form fields to FormData
  formData.append("email", data.email);
  formData.append("name", data.name);
  formData.append("password", data.password);

  `new appeded data is`, formData;
  `received  data is`, data;

  // Append the file to FormData if it exists
  if (file) {
    formData.append("profilePhoto", file);
  } else {
    ("No profile photo selected.");
  }

  try {
    // Send the POST request with axios
    `form data is`, formData;

    const response = await axios.post(
      "http://localhost:3000/auth/signUp",
      file !== undefined ? formData : data,
    );

    `Response:`, response;

    Toastify({
      text: `Signed up successfully`,
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast
      className: "toast-custom",
    }).showToast();

    // Redirect to login page after 3 seconds
    setTimeout(() => {
      window.location.href = "http://localhost:5173/src/pages/login/login.html";
    }, 3000);
  } catch (error: any) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message,
    );
    displayErrors(
      error.response ? error.response.data.message : error.message,
      submitErrorContainer,
    );
  }
}

function displayErrors(errorMessage: string, errorDisplayArea: HTMLDivElement) {
  errorDisplayArea.innerHTML = "";
  const error = document.createElement("p");
  error.innerHTML = "";
  error.innerText = errorMessage;
  error.classList.add("text-errorColor", "font-primary");
  errorDisplayArea.appendChild(error);
}

document
  .getElementById("profilePhoto")
  ?.addEventListener("change", previewImage);

document
  .getElementById("signUpform")
  ?.addEventListener("submit", handleFormSubmit);
