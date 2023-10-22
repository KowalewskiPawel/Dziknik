import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const options = {
  expiresIn: "1h",
};

export const generateJWT = async (userId: number) => {
  try {
    const payload = { userId };
    const token = await jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      options
    );
    return token;
  } catch (error) {
    throw new Error("Generating JWT failed");
  }
};
