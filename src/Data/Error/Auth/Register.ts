const CodeError = (() => {
  let value = 1300

  return Object.freeze({
    TAI_KHOAN_DA_DANG_KY: ++value,
    EMAIL_DA_DANG_KY: ++value,
    PASWORDKHONGKHOP: ++value,
    TAI_KHOAN_BI_KHOA: ++value,
  })
})()

type CodeErrorType = typeof CodeError[keyof typeof CodeError]

const CodeCheckpass = (() => {
  let value = 1400

  return Object.freeze({
    length: ++value,
    IsUpper: ++value,
    Islower: ++value,
    space: ++value,
    special_character: ++value,
  })
})()

type CodeCheckpassType = typeof CodeCheckpass[keyof typeof CodeCheckpass]

type StatusCodeType = CodeErrorType | CodeCheckpassType

export function errorCode(statusCode: StatusCodeType): string | undefined {
  switch (statusCode) {
    case CodeError.TAI_KHOAN_DA_DANG_KY:
      return 'User đã đăng ký.'
  case CodeError.EMAIL_DA_DANG_KY:
      return 'email đã đăng ký'
  case CodeError.PASWORDKHONGKHOP:
      return 'Kiểm tra lại mật khẩu không khớp'
  case CodeCheckpass.length:
      return 'độ dài mật khẩu không hợp lệ'
  case CodeCheckpass.IsUpper:
      return 'mật khẩu chứa ký tự in hoa'
  case CodeCheckpass.Islower:
      return 'mật khẩu phải chứa ký tự in thường'
  case CodeCheckpass.space:
      return 'mật khẩu không hứa khoảng trắng'
  case CodeCheckpass.special_character:
      return 'mật khẩu không chứa ký tự đặc biệt'
  default:
      return undefined
  }
}
