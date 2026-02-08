export type DbHealthChecker = () => Promise<boolean>;

let dbHealthChecker: DbHealthChecker | null = null;

export const registerDbHealthChecker = (cb: DbHealthChecker): void => {
  dbHealthChecker = cb;
};

export const checkDbHealth = async (): Promise<boolean> =>
  !dbHealthChecker ? false : dbHealthChecker();
