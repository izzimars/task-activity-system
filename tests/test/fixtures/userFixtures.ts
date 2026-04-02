export const userFixtures = {
  registerPrimary: {
    email: `primary.${Date.now()}@example.com`,
    password: "Password123!"
  },
  registerSecondary: {
    email: `secondary.${Date.now()}@example.com`,
    password: "Password123!"
  },
  invalidEmail: {
    email: "not-an-email",
    password: "Password123!"
  },
  missingPassword: {
    email: `missing-pass.${Date.now()}@example.com`
  },
  wrongPassword: {
    password: "WrongPassword123!"
  },
  nonExistentLogin: {
    email: `ghost.${Date.now()}@example.com`,
    password: "Password123!"
  }
};

export default userFixtures;
