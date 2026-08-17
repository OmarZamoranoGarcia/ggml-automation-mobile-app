import { apiFetch } from "./api-client";
import { saveSession, StoredUser } from "./storage.service";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: StoredUser;
}

export async function login(
  email: string,
  password: string,
): Promise<StoredUser> {
  const data = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    skipAuthRetry: true, // login nunca debe intentar refrescar un token que no existe
  });

  await saveSession(data.accessToken, data.refreshToken, data.user);

  return data.user;
}
