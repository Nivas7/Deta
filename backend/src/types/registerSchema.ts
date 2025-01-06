import * as yup from "yup";

export interface RegisterSchema {
  username: string;
  email: string;
  password: string;
}

const registerSchema = yup.object({
  username: yup
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be at most 20 characters" })
    .required({ message: "Username is required" }),
  email: yup
    .string()
    .email({ message: "Invalid email address" })
    .required({ message: "Email is required" }),
  password: yup
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .required({ message: "Password is required" }),
});

export default registerSchema;
