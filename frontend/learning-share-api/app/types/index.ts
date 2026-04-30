export type Visibility = "PRIVATE" | "LINK" | "PUBLIC";

export interface CreateLogRequest {
  title: string;
  content: string;
  minutes: number | undefined;
  visibility: Visibility;
  tags: string[];
}

export interface CreateLogResponse {
  id: number;
  title?: string;
  visibility: Visibility;
  shareToken: string | null;
  slug: string | null;
  createdAt?: string;
}

export interface ShareLogResponse {
  id: number;
  title: string;
  content: string;
  minutes: number;
  visibility: Visibility;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  shareToken?: string | null;
  slug?: string | null;
}

export interface LogSummary {
  id: number;
  title: string;
  visibility: Visibility;
  contentPreview: string;
  minutes: number;
  slug: string | null;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}
