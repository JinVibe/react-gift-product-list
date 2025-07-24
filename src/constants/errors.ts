export const ERROR_MESSAGES = {
  // API 관련 에러
  API_ERROR: 'API 요청 중 오류가 발생했습니다.',
  THEME_NOT_FOUND: '해당 테마를 찾을 수 없습니다.',
  PRODUCTS_NOT_FOUND: '상품을 찾을 수 없습니다.',
  LOGIN_FAILED: '로그인에 실패했습니다.',
  ORDER_FAILED: '주문에 실패했습니다.',
  
  // 네트워크 관련 에러
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  
  // 데이터 관련 에러
  INVALID_DATA: '유효하지 않은 데이터입니다.',
  DATA_PARSING_ERROR: '데이터 처리 중 오류가 발생했습니다.',
  
  // 인증 관련 에러
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
  
  // 기본 에러
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
} as const;

export const ERROR_CODES = {
  // HTTP 상태 코드
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  
  // 커스텀 에러 코드
  THEME_NOT_FOUND: 404,
  PRODUCTS_NOT_FOUND: 404,
  NETWORK_ERROR: 0,
  UNKNOWN_ERROR: -1,
} as const;

export interface AppError {
  message: string;
  code: number;
  originalError?: Error;
}

export const createAppError = (
  message: string,
  code: number,
  originalError?: Error
): AppError => ({
  message,
  code,
  originalError,
});

export const createThemeNotFoundError = (): AppError => 
  createAppError(ERROR_MESSAGES.THEME_NOT_FOUND, ERROR_CODES.THEME_NOT_FOUND);

export const createApiError = (status: number, originalError?: Error): AppError => {
  let message: string = ERROR_MESSAGES.API_ERROR;
  let code = status;

  switch (status) {
    case 401:
      message = ERROR_MESSAGES.UNAUTHORIZED;
      break;
    case 403:
      message = ERROR_MESSAGES.FORBIDDEN;
      break;
    case 404:
      message = ERROR_MESSAGES.THEME_NOT_FOUND;
      break;
    case 500:
      message = ERROR_MESSAGES.SERVER_ERROR;
      break;
    default:
      if (status >= 400 && status < 500) {
        message = ERROR_MESSAGES.API_ERROR;
      } else if (status >= 500) {
        message = ERROR_MESSAGES.SERVER_ERROR;
      }
  }

  return createAppError(message, code, originalError);
}; 