import DOMPurify from 'dompurify';

/**
 * DOMPurify를 사용해 HTML 문자열을 정제함
 * - <script>, onerror, javascript: 등 XSS 벡터 제거
 * - <p>, <img>, <ul>, <a> 등 기본 태그는 보존
 *
 * @param {string} html 원본 HTML
 * @returns {string} 정제된 HTML
 */
export const useSanitizeHtml = (html) => {
  if (typeof window === 'undefined' || !html) return '';
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true }, // 기본 안전 프로파일
  });
};
