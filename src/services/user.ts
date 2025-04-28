import User from "../models/User";
import { createHmac, randomBytes } from "node:crypto";
import  JWT  from "jsonwebtoken";

const jwt_secret = 'Yash$5$21'
export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  role: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  private static generateHash(salt: string, password: string) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return hashedPassword;
  }



  public static async createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password, role } = payload;

    // Generate a salt and hash the password
    const salt = randomBytes(32).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    // Create a new User instance
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      salt,
      role,
    });

    try {
      // Save the user to the database
      const savedUser = await user.save();
      return savedUser;
    } catch (err) {
      // Handle potential errors (e.g., duplicate email)
      throw new Error("Error saving user: " + err);
    }
  }
  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("User not found");
    const salt = user.salt;
    const hashedPassword = UserService.generateHash(salt, password);
    if (hashedPassword !== user.password) throw new Error("Incorrect password");
    const token = JWT.sign(
      { id: user._id, email: user.email, role: user.role },
      jwt_secret,
      { expiresIn: "7d" }
    );
    return token;
  }
}

export default UserService;
