export type Config = {
  app: AppConfig;
  database: DatabaseConfig;
  jwt: JWTConfig;
  aws: AWSConfig;
};

export type AppConfig = {
  port: number;
  host: string;
};

export type DatabaseConfig = {
  port: number;
  host: string;
  user: string;
  password: string;
  dbName: string;
};

export type JWTConfig = {
  accessSecret: string;
  accessExpiresIn: number;
  refreshSecret: string;
  refreshExpiresIn: number;
};

export type AWSConfig = {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  endpoint: string;
};
