const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface ApiFetchOptions extends RequestInit {
  token?: string;
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Callback que el AuthContext registra al montar
let onUnauthorized: (() => void) | null = null;

export function registerUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      onUnauthorized?.(); // notifica al AuthContext, si está registrado
    }
    throw new ApiError(data?.message || "Error en la petición", res.status);
  }

  return data as T;
}
