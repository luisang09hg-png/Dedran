export const mockAuth = {
  signIn: async (credentials: any) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.password === "error") {
          reject(new Error("Invalid email or password"));
        } else {
          resolve({ user: { name: "Luis", email: credentials.email } });
        }
      }, 1500);
    });
  },
  signUp: async (data: any) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.email === "error@test.com") {
          reject(new Error("Email already in use"));
        } else {
          resolve({ user: { name: data.name, email: data.email } });
        }
      }, 1500);
    });
  },
  signOut: async () => {
    return new Promise((resolve) => setTimeout(resolve, 500));
  },
};
