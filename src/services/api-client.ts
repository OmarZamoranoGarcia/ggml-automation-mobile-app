import { getRefreshToken, updateAccessToken } from "./storage.service";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface ApiFetchOptions extends RequestInit {
  token?: string;
  skipAuthRetry?: boolean; // evita el reintento automático (usado por login/refresh)
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

let onUnauthorized: (() => void) | null = null;

export function registerUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

// Evita que múltiples requests simultáneos disparen refresh en paralelo
let refreshPromise: Promise<string | null> | null = null;

async function performTokenRefresh(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Platform": "mobile",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    await updateAccessToken(data.accessToken);
    return data.accessToken as string;
  } catch {
    return null;
  }
}

function getOrCreateRefreshPromise(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = performTokenRefresh().finally(() => {
      refreshPromise = null; // libera para el siguiente 401 que ocurra después
    });
  }
  return refreshPromise;
}

async function doFetch(
  path: string,
  options: ApiFetchOptions,
): Promise<Response> {
  const { token, headers, skipAuthRetry, ...rest } = options;

  return fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      "X-Client-Platform": "mobile",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  let res = await doFetch(path, options);

  if (res.status === 401 && !options.skipAuthRetry) {
    const newAccessToken = await getOrCreateRefreshPromise();

    if (newAccessToken) {
      // reintenta el request original, una sola vez, con el token renovado
      res = await doFetch(path, { ...options, token: newAccessToken });
    } else {
      onUnauthorized?.();
      const data = await res.json().catch(() => null);
      throw new ApiError(data?.message || "Sesión expirada", 401);
    }
  }

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      onUnauthorized?.();
    }
    throw new ApiError(data?.message || "Error en la petición", res.status);
  }

  return data as T;
}
