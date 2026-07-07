// Shared, pre-seeded login user (created in global-setup, read-only in tests).
export const TEST_USER = {
  email: "test-user@example.com",
  password: "Password123!",
  phone: "+441234567890",
};

// Generates a unique email so parallel projects/tests never collide on signup.
export function uniqueEmail(prefix = "e2e"): string {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}@example.com`;
}
