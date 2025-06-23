import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PasswordReset, PasswordResetDocument } from "./entity";

@Injectable()
export class PasswordResetRepository {
  constructor(
    @InjectModel(PasswordReset.name)
    private model: Model<PasswordResetDocument>,
  ) {}

  async save(data: Partial<PasswordReset>) {
    return this.model.create(data);
  }

  async findByToken(token: string) {
    return this.model.findOne({ token }).exec();
  }

  async deleteByToken(token: string) {
    return this.model.deleteOne({ token }).exec();
  }

  async deleteAllForUser(userId: string) {
  return this.model.deleteMany({ userId }).exec();
}
}

export default PasswordResetRepository;
