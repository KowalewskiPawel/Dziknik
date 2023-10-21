import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Hashing failed error: ${JSON.stringify(error)}`);
  }
};
