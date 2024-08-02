import { ILogInForm } from "../../interface/logInForm";
import { ISignUpForm } from "../../interface/signUpForm";
import { loginUserBodySchema, signUpUserBodySchema } from "../../schema/user";
import axios from "axios";
import Toastify from "toastify-js";

const submitErrorContainer = document.getElementById(
  "submit_error_container"
) as HTMLDivElement;

function handleFormSubmit(event: Event): void {
  event.preventDefault();

  const target = event.target as HTMLFormElement;
  console.log(`came inside login handle button`);

  const data = {
    email: target.email.value,
    password: target.password.value,
  };

  // Validate the data
  const { error } = loginUserBodySchema.validate(data);
  if (error) {
    displayErrors(error.message, submitErrorContainer);
  } else {
    console.log(`inside handle submit form`, data);
    submitLogInForm(data);
  }
}

async function submitLogInForm(data: ILogInForm) {
  // Create a new FormData instance

  try {
    // Send the POST request with axios
    const response = await axios.post("http://localhost:3000/auth/login", data);

    localStorage.setItem("accessToken", `${response.data.accessToken}`);

    // Redirect to login page after 3 seconds
    setTimeout(() => {
      window.location.href = "http://localhost:5173/src/pages/feed/feed.html";
    }, 3000);

    Toastify({
      text: `Logged In successfully`,
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast
      className: "toast-custom",
    }).showToast();
  } catch (error: any) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    displayErrors(
      error.response ? error.response.data.message : error.message,
      submitErrorContainer
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
  .getElementById("loginForm")
  ?.addEventListener("submit", handleFormSubmit);
