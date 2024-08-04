document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.getElementById("sign-in-btn") as HTMLButtonElement;
  signInBtn.addEventListener("click", () => {
    window.location.href = "../login/login.html";
  });
});
