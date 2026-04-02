type Meta = Record<string, unknown>;

const formatMeta = (meta?: Meta): string => (meta ? ` ${JSON.stringify(meta)}` : "");

export const logger = {
  info: (message: string, meta?: Meta): void => {
    console.log(`[INFO] ${new Date().toISOString()} ${message}${formatMeta(meta)}`);
  },
  error: (message: string, meta?: Meta): void => {
    console.error(`[ERROR] ${new Date().toISOString()} ${message}${formatMeta(meta)}`);
  },
  warn: (message: string, meta?: Meta): void => {
    console.warn(`[WARN] ${new Date().toISOString()} ${message}${formatMeta(meta)}`);
  }
};
