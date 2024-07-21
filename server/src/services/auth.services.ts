import { User } from "../interfaces/user.interfaces";

const signUp = (
  body: Pick<
    User,
    | "email"
    | "password"
    | "name"
    | "photo_url"
    | "headline"
    | "summary"
    | "contact_info"
  >
) => {};
