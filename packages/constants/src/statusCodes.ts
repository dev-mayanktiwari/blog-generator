export const SuccessStatusCodes = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
} as const;

export const ErrorStatusCodes = {
  CLIENT_ERROR: {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
  },
  SERVER_ERROR: {
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
  },
} as const;

export const WSStatusCodes = {
  UNAUTHORIZED: 4001,
  TOKEN_EXPIRED: 4002,
  INTERNAL_ERROR: 4003,
} as const;

export type TSuccessStatusCodes =
  (typeof SuccessStatusCodes)[keyof typeof SuccessStatusCodes];
export type TClientErrorStatusCodes =
  (typeof ErrorStatusCodes.CLIENT_ERROR)[keyof typeof ErrorStatusCodes.CLIENT_ERROR];
export type TServerErrorStatusCodes =
  (typeof ErrorStatusCodes.SERVER_ERROR)[keyof typeof ErrorStatusCodes.SERVER_ERROR];
export type TStatusCodes =
  | TSuccessStatusCodes
  | TClientErrorStatusCodes
  | TServerErrorStatusCodes;
export type TWSStatusCodes = (typeof WSStatusCodes)[keyof typeof WSStatusCodes];
