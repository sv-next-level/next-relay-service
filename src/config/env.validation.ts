import { plainToInstance } from "class-transformer";
import { IsEnum, IsNumber, Max, Min, validateSync } from "class-validator";

import { ENVIRONMENT } from "@/constants";

class ENV_VARIABLES {
  @IsEnum(ENVIRONMENT)
  NODE_ENV: ENVIRONMENT;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(ENV_VARIABLES, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}