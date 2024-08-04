import { ILogInForm } from "../../interface/logInForm";
import { ISignUpForm } from "../../interface/signUpForm";
import { loginUserBodySchema, signUpUserBodySchema } from "../../schema/user";
import axios from "axios";
import Toastify from "toastify-js";
import { customToast } from "../../utils/toast";

const submitErrorContainer = document.getElementById(
  "submit_error_container",
) as HTMLDivElement;

function handleFormSubmit(event: Event): void {
  event.preventDefault();

  const target = event.target as HTMLFormElement;
  `came inside login handle button`;

  const data = {
    email: target.email.value,
    password: target.password.value,
  };

  // Validate the data
  const { error } = loginUserBodySchema.validate(data);
  if (error) {
    customToast(error.message);
  } else {
    submitLogInForm(data);
  }
}

async function submitLogInForm(data: ILogInForm) {
  // Create a new FormData instance

  try {
    // Send the POST request with axios
    const response = await axios.post("http://localhost:3000/auth/login", data);
    console.log(`sdfasdfa`, response);

    if (response.status === 200) {
      localStorage.setItem("accessToken", `${response.data.accessToken}`);
      customToast("logged In Successfully");
      setTimeout(() => {
        window.location.href = "http://localhost:5173/src/pages/feed/feed.html";
      }, 2000);
    } else {
      customToast(response.data.message);
    }

    // Redirect to login page after 3 seconds
  } catch (error: any) {
    customToast(error.response.data.message);
  }
}

document
  .getElementById("loginForm")
  ?.addEventListener("submit", handleFormSubmit);
