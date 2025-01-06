import * as yup from "yup";

export interface LoginSchema {
  email: string;
  password: string;
}

const loginSchema = yup.object({
  email: yup
    .string()
    .email({ message: "Invalid email address" })
    .required({ message: "Email is required" }),
  password: yup
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .required({ message: "Password is required" }),
});

export default loginSchema;
