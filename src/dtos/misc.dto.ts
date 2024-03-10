import mongoose from "mongoose";

export const isMongoIdValid = (id: string): boolean => {
  return mongoose.isValidObjectId(id);
};
