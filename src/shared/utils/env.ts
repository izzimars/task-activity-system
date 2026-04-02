export const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key} ------- ${process.env[key] ? `(current value: ${process.env[key]})` : ''}`);
  }
  return value;
};

export const getEnvNumber = (key: string, defaultValue?: number): number => {
  const fallback = defaultValue !== undefined ? String(defaultValue) : undefined;
  const value = getEnv(key, fallback);
  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }

  return parsed;
};
