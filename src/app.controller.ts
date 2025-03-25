import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get(':id')
  getUser(@Param('id') userId: number) {
    const res = this.appService.getUsers(userId);
    return res;
  }
}


/**
 * TODO:
 * handle this scenario
 * ```ts
 * getUser(@Param('id') userId: number) {
 * const res = this.appService.getUsers(userId);
 *   return res;
 * }
 * ``` if (calledDeclaration) {
                console.log(`Called function/method: ${calledDeclaration.getName()}`);
                console.log(calledDeclaration.getText());
              } else {
                console.log("Could not resolve the called function/method.");
              }
 */

