import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export const customToast = (responseMsg: string) => {
  Toastify({
    text: `${responseMsg}`,
    duration: 3000,
    destination: "https://github.com/apvarun/toastify-js",
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    className: "toast-custom",
    style: {
      color: "white",
      fontWeight: "bold",
      fontStyle: "Montserrat",
      background: "rebeccapurple",
      borderRadius: "9px",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
};
