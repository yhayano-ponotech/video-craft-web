// ビデオ情報の型定義
export interface VideoInfo {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    formats: VideoFormat[];
  }
  
  // ビデオフォーマットの型定義
  export interface VideoFormat {
    formatId: string;
    quality: string;
    container: string;
    resolution: string;
    fps?: number;
    filesize?: number;
    audioQuality?: string;
  }
  
  // 動画変換オプションの型定義
  export interface ConversionOptions {
    format: string;
    quality?: string;
    fps?: number;
    audioQuality?: string;
  }
  
  // 動画トリミングのパラメータ型定義
  export interface TrimOptions {
    startTime: number; // 秒単位
    endTime: number;   // 秒単位
  }
  
  // 画像抽出のパラメータ型定義
  export interface ExtractOptions {
    timePosition: number; // 秒単位
    quality?: 'low' | 'medium' | 'high';
    format?: 'jpg' | 'png';
  }
  
  // API応答の型定義
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }
  
  // 処理進捗状況の型定義
  export interface ProcessProgress {
    status: 'idle' | 'loading' | 'processing' | 'success' | 'error';
    progress: number; // 0-100
    message?: string;
  }