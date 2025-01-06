import User from "../models/User.js";

async function validateUser(email: string) {
  const user = await User.findOne({ email });

  if (user == null) {
    return false;
  }
  return true;
}

export default validateUser;
