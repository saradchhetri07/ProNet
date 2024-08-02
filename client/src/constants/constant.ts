import { User } from "../interface/user.interface";

export const serverUrl = "http://localhost:3000";

export const accessToken = localStorage.getItem("accessToken");

export const myDetails = {
  myId: localStorage.getItem("myId"),
  myName: localStorage.getItem("myName")!,
  myEmail: localStorage.getItem("myEmail")!,
  myProfilePhotoUrl: localStorage.getItem("myProfilePhotoUrl")!,
  myCoverPhotoUrl: localStorage.getItem("myCoverPhotoUrl")!,
};
