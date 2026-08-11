
export default interface INews {
  news_id?: string;
  headline?: string;
  summary?: string;
  content_preview?: string;
  source_name?: string;
  article_url?: string | null;
  published_at?: string;
  received_at?: string;
  instrument_refs?: string[];
  delayed?: boolean;
  stale?: boolean;
  title?: string;
  link?: string;
  keywords: string[];
  creator: string[];
  video_url: string | null;
  description: string;
  content: string | null;
  pubDate: string;
  full_description: string;
  full_text?: string;
  image_url: string | null;
  source_id: string;
  country: string[];
  category: string[];
  language: string;
  article_id?: string;
  url?: string;
  text?: string;
  publisher?: string;
}
