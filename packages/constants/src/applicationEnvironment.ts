export const ApplicationEnvironment = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
};

export type TApplicationEnvironment =
  (typeof ApplicationEnvironment)[keyof typeof ApplicationEnvironment];
