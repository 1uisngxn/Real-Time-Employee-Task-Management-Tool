// utils/phoneUtils.js

/**
 * Chuẩn hóa số điện thoại về định dạng E.164 (dùng cho Firebase Auth)
 * @param {string} phone - Số điện thoại người dùng nhập
 * @returns {string} - Số điện thoại chuẩn hóa
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return "";

  // Xóa khoảng trắng và ký tự không cần thiết
  const cleaned = phone.replace(/\s+/g, "").replace(/[^0-9+]/g, "");

  // Nếu bắt đầu bằng 0 thì thay bằng +84 (VN)
  if (cleaned.startsWith("0")) {
    return "+84" + cleaned.substring(1);
  }

  // Nếu đã nhập +84 hoặc +... thì giữ nguyên
  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  // Fallback: giả định là số VN nếu chỉ nhập 9 số
  return "+84" + cleaned;
};
