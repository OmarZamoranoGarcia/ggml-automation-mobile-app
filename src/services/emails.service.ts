import { Email, EmailFile } from "@/types/email";
import { apiFetch } from "./api-client";
import { getToken } from "./storage.service";

export interface EmailsResponse {
  data: Email[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getEmails(page = 1, limit = 20): Promise<EmailsResponse> {
  const token = await getToken();

  return apiFetch<EmailsResponse>(`/emails?page=${page}&limit=${limit}`, {
    method: "GET",
    token: token ?? undefined,
  });
}

export async function getEmailFiles(emailId: string): Promise<EmailFile[]> {
  const token = await getToken();

  return apiFetch<EmailFile[]>(`/emails/${emailId}/files`, {
    method: "GET",
    token: token ?? undefined,
  });
}
