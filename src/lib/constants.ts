export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Official Yodda account ID
export const OFFICIAL_YODDA_ID = '67ece9e577fb0dd27c504083';

// Check if a user ID is the official Yodda account
export const isOfficialAccount = (userId: string | undefined): boolean => {
  return userId === OFFICIAL_YODDA_ID;
};
