import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

import { EMAIL_TYPE, SERVICE_TYPE } from "@/constants";

export class SendEmailDTO {
  @IsString()
  @IsNotEmpty()
  readonly to: string;

  @IsNotEmpty()
  @IsString()
  readonly data: string;

  @IsNotEmpty()
  @IsNumber()
  readonly expires_after: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(EMAIL_TYPE, { message: "Invalid email type!" })
  readonly email_type: EMAIL_TYPE;

  @IsNotEmpty()
  @IsString()
  @IsEnum(SERVICE_TYPE, { message: "Invalid service request!" })
  readonly requesting_service_type: SERVICE_TYPE;
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
