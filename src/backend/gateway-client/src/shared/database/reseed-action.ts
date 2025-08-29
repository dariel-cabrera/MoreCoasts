import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/shema/user.shema';

@Injectable()
export class ReseedAction {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async execute() {
    await this.userModel.deleteMany({});
  }
}
