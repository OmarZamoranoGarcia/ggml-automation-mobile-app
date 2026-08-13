import { apiFetch } from "./api-client";
import { getToken } from "./storage.service";

export interface LogEntry {
  level: "Error" | "Warning" | "Info";
  message: string;
}

export interface EmailResult {
  emailId?: string;
  subject?: string;
  from?: string;
  status?: "COMPLETED" | "SKIPPED" | "NOT_PROCESSED" | "ERROR";
  errorMessage?: string;
  note?: string;
}

export interface EmailCheckResult {
  success: boolean;
  totalEmailsFound: number;
  processed: number;
  skipped: number;
  notProcessed: number;
  errors: number;
  emails: EmailResult[];
  logs: LogEntry[];
}

export async function checkEmails(): Promise<EmailCheckResult> {
  const token = await getToken();

  return apiFetch<EmailCheckResult>("/ggml-automation/email/check", {
    method: "GET",
    token: token ?? undefined,
  });
}
