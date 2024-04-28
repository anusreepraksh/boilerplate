import { UserModel } from "./users.model";

export default class UserDatasource {
  private readonly userModel = UserModel;
  async getUserById(_id: String) {
    return this.userModel.findById(_id);
  }
}
