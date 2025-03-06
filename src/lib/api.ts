'use client';

import axios from 'axios';
import { 
  YoutubeVideoInfo, 
  DownloadTask,
  ConversionTask,
  TrimTask,
  ScreenshotTask,
  CompressTask,
  ApiResponse
} from './types';

// APIのベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Axiosインスタンスの作成
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // CORS設定による
});

// YouTube動画情報の取得
export async function getVideoInfo(youtubeUrl: string): Promise<ApiResponse<YoutubeVideoInfo>> {
  try {
    const response = await apiClient.get<ApiResponse<YoutubeVideoInfo>>('/video/info', {
      params: { url: youtubeUrl },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<YoutubeVideoInfo>;
    }
    return {
      success: false,
      error: '動画情報の取得に失敗しました。ネットワーク接続を確認してください。',
    };
  }
}

// 動画ダウンロードの開始
export async function startDownload(youtubeUrl: string, itag: number): Promise<ApiResponse<DownloadTask>> {
  try {
    const response = await apiClient.post<ApiResponse<DownloadTask>>('/video/download', {
      url: youtubeUrl,
      itag,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<DownloadTask>;
    }
    return {
      success: false,
      error: 'ダウンロードの開始に失敗しました。ネットワーク接続を確認してください。',
    };
  }
}

// ダウンロード状態の取得
export async function getDownloadStatus(taskId: string): Promise<ApiResponse<DownloadTask>> {
  try {
    const response = await apiClient.get<ApiResponse<DownloadTask>>(`/video/download/${taskId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<DownloadTask>;
    }
    return {
      success: false,
      error: 'ダウンロード状態の取得に失敗しました。',
    };
  }
}

// 動画変換の開始
export async function startConversion(
  formData: FormData
): Promise<ApiResponse<ConversionTask>> {
  try {
    const response = await apiClient.post<ApiResponse<ConversionTask>>('/video/convert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<ConversionTask>;
    }
    return {
      success: false,
      error: '変換の開始に失敗しました。ファイルのサイズを確認してください。',
    };
  }
}

// 変換状態の取得
export async function getConversionStatus(taskId: string): Promise<ApiResponse<ConversionTask>> {
  try {
    const response = await apiClient.get<ApiResponse<ConversionTask>>(`/video/convert/${taskId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<ConversionTask>;
    }
    return {
      success: false,
      error: '変換状態の取得に失敗しました。',
    };
  }
}

// 動画トリミングの開始
export async function startTrimming(
  formData: FormData
): Promise<ApiResponse<TrimTask>> {
  try {
    const response = await apiClient.post<ApiResponse<TrimTask>>('/video/trim', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<TrimTask>;
    }
    return {
      success: false,
      error: 'トリミングの開始に失敗しました。',
    };
  }
}

// トリミング状態の取得
export async function getTrimmingStatus(taskId: string): Promise<ApiResponse<TrimTask>> {
  try {
    const response = await apiClient.get<ApiResponse<TrimTask>>(`/video/trim/${taskId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<TrimTask>;
    }
    return {
      success: false,
      error: 'トリミング状態の取得に失敗しました。',
    };
  }
}

// スクリーンショット取得の開始
export async function takeScreenshot(
  formData: FormData
): Promise<ApiResponse<ScreenshotTask>> {
  try {
    const response = await apiClient.post<ApiResponse<ScreenshotTask>>('/video/screenshot', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<ScreenshotTask>;
    }
    return {
      success: false,
      error: 'スクリーンショットの取得に失敗しました。',
    };
  }
}

// スクリーンショット状態の取得
export async function getScreenshotStatus(taskId: string): Promise<ApiResponse<ScreenshotTask>> {
  try {
    const response = await apiClient.get<ApiResponse<ScreenshotTask>>(`/video/screenshot/${taskId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<ScreenshotTask>;
    }
    return {
      success: false,
      error: 'スクリーンショット状態の取得に失敗しました。',
    };
  }
}

// 動画圧縮の開始
export async function startCompression(
  formData: FormData
): Promise<ApiResponse<CompressTask>> {
  try {
    const response = await apiClient.post<ApiResponse<CompressTask>>('/video/compress', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<CompressTask>;
    }
    return {
      success: false,
      error: '圧縮の開始に失敗しました。ファイルのサイズを確認してください。',
    };
  }
}

// 圧縮状態の取得
export async function getCompressionStatus(taskId: string): Promise<ApiResponse<CompressTask>> {
  try {
    const response = await apiClient.get<ApiResponse<CompressTask>>(`/video/compress/${taskId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<CompressTask>;
    }
    return {
      success: false,
      error: '圧縮状態の取得に失敗しました。',
    };
  }
}

// ファイルのダウンロードURLを生成
export function getFileDownloadUrl(filePath: string): string {
  return `${API_BASE_URL}/download?path=${encodeURIComponent(filePath)}`;
}

export default {
  getVideoInfo,
  startDownload,
  getDownloadStatus,
  startConversion,
  getConversionStatus,
  startTrimming,
  getTrimmingStatus,
  takeScreenshot,
  getScreenshotStatus,
  startCompression,
  getCompressionStatus,
  getFileDownloadUrl,
};