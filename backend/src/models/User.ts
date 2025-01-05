import mongoose from "mongoose";
import { UserAttrs } from "../types/types.js";
import { Password } from "../services/password.service.js";

export type UserDocument = mongoose.Document & {
  username: string;
  email: string;
  password: string;
  movies: mongoose.Schema.Types.ObjectId[];
  expenses: mongoose.Schema.Types.ObjectId[];
  jobs: mongoose.Schema.Types.ObjectId[];
  files: mongoose.Schema.Types.ObjectId[];
};

interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    movies: [{ type: mongoose.Schema.Types.ObjectId }],
    expenses: [{ type: mongoose.Schema.Types.ObjectId }],
    jobs: [{ type: mongoose.Schema.Types.ObjectId }],
    files: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret, _options) {
        delete ret.password;
        delete ret.__v;
      },
    },
  },
);

UserSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

UserSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.genPasswordHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

export const User = mongoose.model<UserDocument, UserModel>("User", UserSchema);
