export interface IApiResponse {
  data?: any;
  error?: any;
  statusCode: number;
}

export const OK = (data: unknown): IApiResponse => {
  return {
    statusCode: 200,
    data: data,
    error: null,
  };
};

export const Created = (data: unknown): IApiResponse => {
  return {
    statusCode: 201,
    data: data,
    error: null,
  };
};

export const BadRequest = (error: unknown): IApiResponse => {
  return {
    statusCode: 400,
    error: error,
    data: null,
  };
};

export const Unauthorized = (error: unknown): IApiResponse => {
  return {
    statusCode: 401,
    error: error,
    data: null,
  };
};

export const InternalServerError = (error: unknown): IApiResponse => {
  return {
    statusCode: 500,
    error: error,
    data: null,
  };
};
