import { apiFetch } from "./api-client";
import { saveSession, StoredUser } from "./storage.service";

interface LoginResponse {
  accessToken: string;
  user: StoredUser;
}

export async function login(
  email: string,
  password: string,
): Promise<StoredUser> {
  const data = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  await saveSession(data.accessToken, data.user);

  return data.user;
}
