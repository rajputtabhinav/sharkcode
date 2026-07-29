// Temporary auth helper - replaces Clerk auth
// This is a placeholder until a new authentication service is added

export async function getTempUserId(): Promise<string | null> {
  // Return null to simulate not being authenticated
  return null;
}

export async function auth() {
  return {
    userId: null as string | null,
  };
}

// For backward compatibility with existing code
export { auth as default };

