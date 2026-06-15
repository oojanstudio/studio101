export interface DocumentRecord {
  id: string;
  title: string | null;
  content: string | null;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

export interface DocumentMedia {
  id: string;
  document_id: string;
  owner_id: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  storage_path: string;
  created_at: string;
}

export interface DocumentThumbnail {
  id: string;
  document_id: string;
  owner_id: string;
  sequence_number: number;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  storage_path: string;
  created_at: string;
}