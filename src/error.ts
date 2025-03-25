import { ApiProperty } from '@nestjs/swagger';
import { Type, NotFoundException } from '@nestjs/common';

//export class CustomNotFoundException extends NotFoundException {
//  @ApiProperty({ example: 404, description: 'HTTP status code for not found' })
//  statusCode: number;
//
//  @ApiProperty({ example: 'Not Found', description: 'A string literal representing the error status' })
//  error: string;
//
//  constructor(message?: string) {
//    super(message || 'Entity not found');
//    this.statusCode = 404;
//    this.error = 'Not Found';
//  }
//}

export class Exception { }

export class Ok {
  @ApiProperty({ example: 200, description: 'HTTP status code for creation' })
  readonly statusCode: 200;

  @ApiProperty({ example: 'Success', description: 'A string literal representing the status' })
  readonly status: 'Success';

  constructor() {
    this.statusCode = 200;
    this.status = 'Success';
  }
}

export class User {
  @ApiProperty({ example: "emad", description: 'first name of the user' })
  readonly firstname: string;

  constructor(firstname: string) {
    this.firstname = firstname;
  }
}

export function OkWithData<T>(dataDto: Type<T>): Type<Ok & { data: T }> {
  class OkWithDataDto extends Ok {
    @ApiProperty({
      // Using getSchemaPath helps Swagger understand the nested type.
      type: dataDto,
      description: 'Actual response data'
    })
    data: T;
  }
  return OkWithDataDto;
}


export const OkUserData = OkWithData(User);


export class Created {
  @ApiProperty({ example: 201, description: 'HTTP status code for creation' })
  readonly statusCode: 201;

  @ApiProperty({ example: 'Created', description: 'A string literal representing the status' })
  readonly status: 'Created';

  @ApiProperty({ example: 'Entity created successfully', description: 'A message detailing the operation result' })
  readonly message: string;

  constructor(message: string = 'Entity created successfully') {
    this.statusCode = 201;
    this.status = 'Created';
    this.message = message;
  }
}

export class NotFound extends NotFoundException {
  @ApiProperty({ example: 404, description: 'HTTP status code for creation' })
  readonly statusCode: 404;

  @ApiProperty({ example: 'Not Found', description: 'A string literal representing the status' })
  readonly status: 'Not Found';

  //@ApiProperty({ example: 'Not Found', description: 'A message detailing the operation result' })
  //readonly message: string;

  constructor(message: string = 'Unable to find') {
    super(message);

    this.statusCode = 404;
    this.status = 'Not Found';
    this.message = message;
  }
}

