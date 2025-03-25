import { Injectable } from '@nestjs/common';
import { Created, NotFound, OkUserData } from "./error";

@Injectable()
export class AppService {
  getUsers(n: number) {
    if (n < 10) {
      return new Created()
    } else if (n < 10) {
      throw new NotFound()
    } else {
      return new OkUserData("emad")
    }
  }
}
