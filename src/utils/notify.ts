import { ElNotification } from 'element-plus';

export function notifyError(message: string) {
  ElNotification.error({ title: 'Ошибка', message });
}
export function notifySuccess(message: string) {
  ElNotification.success({ title: 'Успех', message });
}
