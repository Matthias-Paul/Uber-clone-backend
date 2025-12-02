import mongoose, { Document, Schema } from "mongoose";
import bcryptjs from "bcryptjs";

interface IUser extends Document {
  username: string;
  email: string;
  verified_user: boolean;
  password: string;
  role: "driver" | "rider";
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    verified_user: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: {
        values: ["driver", "rider"],
        message: "Role must be either driver or rider",
      },
      default: "rider",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving 
userSchema.pre("save", async function () {
  // Only hash if password is modified
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcryptjs.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
