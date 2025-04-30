// src/services/timeTrackingService.ts
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7223/api';

interface TimeTrackingResponse {
  success: boolean;
  message?: string;
  data?: any;
}

interface TimeSummary {
  todayTotal: number;
  weekTotal: number;
  monthTotal: number;
  allTimeTotal: number;
  byContentType: Record<string, number>;
  recentDays: Record<string, number>;
}

export const trackTime = async (
  contentId: string,
  contentType: string,
  seconds: number
): Promise<TimeTrackingResponse> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(
      `${API_BASE_URL}/timetracking/update`,
      {
        contentId,
        contentType,
        seconds
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error tracking time:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
    console.error('Unexpected error tracking time:', error);
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
};

export const getTimeSummary = async (): Promise<TimeSummary> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_BASE_URL}/timetracking/summary`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data as TimeSummary;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error getting time summary:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get time summary');
    }
    console.error('Unexpected error getting time summary:', error);
    throw new Error('An unexpected error occurred');
  }
};

export const validateYouTubeVideo = async (videoId: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(
      `${API_BASE_URL}/timetracking/validate-youtube?videoId=${videoId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data.isValid as boolean;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error validating YouTube video:', error.response?.data || error.message);
      return false;
    }
    console.error('Unexpected error validating YouTube video:', error);
    return false;
  }
};