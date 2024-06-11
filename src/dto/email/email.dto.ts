import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

import { EMAIL_ACTION, TYPE } from "@/common/notification";
import { SERVICE } from "@/common/server/service";

export class SendEmailDTO {
  @IsString()
  @IsNotEmpty()
  readonly to: string;

  @IsNotEmpty()
  readonly data: any;

  @IsNotEmpty()
  @IsString()
  @IsEnum(TYPE, { message: "Invalid email type!" })
  readonly type: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(EMAIL_ACTION, { message: "Invalid email action!" })
  readonly action: string;

  @IsNotEmpty()
  @IsNumber()
  readonly expires_after: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(SERVICE, { message: "Invalid service request!" })
  readonly requesting_service: string;
}

export class VerifyEmailDTO {
  @IsNotEmpty()
  @IsMongoId()
  readonly relayId: string;

  @IsOptional()
  @IsString()
  readonly data?: string;
}

export class ResendEmailDTO {
  @IsNotEmpty()
  @IsMongoId()
  readonly relayId: string;

  @IsNotEmpty()
  @IsString()
  readonly data: string;

  @IsNotEmpty()
  @IsNumber()
  readonly expires_after: number;
}
