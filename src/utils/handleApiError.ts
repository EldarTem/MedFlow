import { ElNotification } from 'element-plus';

export function handleApiError(error: any, fallbackMsg = 'Произошла ошибка') {
  if (error?.response?.data?.message) {
    ElNotification.error(error.response.data.message);
  } else {
    ElNotification.error(fallbackMsg);
  }
}
