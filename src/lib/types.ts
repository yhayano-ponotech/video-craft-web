// YouTube動画情報の型定義
export interface YoutubeVideoInfo {
  videoId: string;
  title: string;
  author: string;
  thumbnailUrl: string;
  duration: number; // 秒数
  formats: VideoFormat[];
}

// ビデオフォーマットの型定義
export interface VideoFormat {
  itag: number;
  quality: string;
  mimeType: string;
  container: string;
  hasVideo: boolean;
  hasAudio: boolean;
  codecs: string;
  bitrate: number;
  size?: number; // バイト数
}

// ダウンロードタスクの型定義
export interface DownloadTask {
  id: string;
  url: string;
  format: VideoFormat;
  progress: number; // 0-100
  status: 'pending' | 'downloading' | 'processing' | 'completed' | 'error';
  error?: string;
  outputPath?: string;
}

// 変換タスクの型定義
export interface ConversionTask {
  id: string;
  inputFile: File | string; // Fileオブジェクトまたはファイルパス
  outputFormat: string;
  progress: number; // 0-100
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  outputPath?: string;
}

// トリミングタスクの型定義
export interface TrimTask {
  id: string;
  inputFile: File | string; // Fileオブジェクトまたはファイルパス
  startTime: number; // 秒数
  endTime: number; // 秒数
  outputFormat: string;
  progress: number; // 0-100
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  outputPath?: string;
}

// スクリーンショットタスクの型定義
export interface ScreenshotTask {
  id: string;
  inputFile: File | string; // Fileオブジェクトまたはファイルパス
  timestamp: number; // 秒数
  format: 'jpg' | 'png';
  progress: number; // 0-100
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  outputPath?: string;
}

// 圧縮タスクの型定義
export interface CompressTask {
  id: string;
  inputFile: File | string; // Fileオブジェクトまたはファイルパス
  compressionLevel: 'light' | 'medium' | 'high';
  resolution: 'original' | '1080p' | '720p' | '480p';
  progress: number; // 0-100
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  outputPath?: string;
  outputSize?: number; // 圧縮後のファイルサイズ（バイト）
}

// APIレスポンスの型定義
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}