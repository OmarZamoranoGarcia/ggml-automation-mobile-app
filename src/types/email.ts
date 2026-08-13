interface Email {
  id: string;
  arrival_at: string;
  arrival_email: string;
  subject: string;
  body: string;
  status: string;
}

interface EmailFile {
  id: string;
  email_id: string;
  file_name: string;
  file_type: string;
  file_role: string;
  storage_path: string;
  created_at: string;
  public_url?: string;
}

export { Email, EmailFile };

