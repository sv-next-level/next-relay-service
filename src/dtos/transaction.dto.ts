import {
  Communications,
  Methods,
  Services,
  To,
} from "@/schemas/transaction.schema";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class sendTo {
  @IsNotEmpty()
  @IsArray()
  readonly emails: string[];
}

export class sendTransactionDto {
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  readonly to: To;

  @IsNotEmpty()
  @IsString()
  readonly data: string;

  @IsNotEmpty()
  @IsArray()
  @IsEnum(Methods, { each: true, message: "Invalid sending method!" })
  readonly methods: Methods[];

  @IsOptional()
  @IsNumber()
  readonly expires_after?: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(Services, { message: "Invalid service request!" })
  readonly requesting_service: Services;

  @IsNotEmpty()
  @IsString()
  @IsEnum(Communications, { message: "Invalid communication mode!" })
  readonly comminucation_mode: Communications;
}

export interface emailDataType {
  list: String[];
  subject: Communications;
  message: String;
}
