/**
 * error code 说明.
 *    0: 成功
 *    40001: 签名验证错误
 *    40002: xml解析失败
 *    40003: sha加密生成签名失败
 *    40004: encodingAesKey 非法
 *    40005: appid 校验错误
 *    40006: aes 加密失败
 *    40007: aes 解密失败
 *    40008: 解密后得到的buffer非法
 *    40009: base64加密失败
 *    40010: base64解密失败
 *    40011: 生成xml失败
 */
export class ErrorCode {
  /**
   * 0 表示操作成功
   */
  public static OK = 0;

  /**
   * -40001 在验证签名时发生错误
   */
  public static ValidateSignatureError = -40001;

  /**
   * -40002 解析 XML 时发生错误
   */
  public static ParseXmlError = -40002;

  /**
   * -40003 在计算签名时发生错误
   */
  public static ComputeSignatureError = -40003;

  /**
   * -40004 非法 AES 密钥
   */
  public static IllegalAesKey = -40004;

  /**
   * -40005 验证 AppId 失败
   */
  public static ValidateAppidError = -40005;

  /**
   * -40006 加密消息时发生错误
   */
  public static EncryptAESError = -40006;

  /**
   * -40007 解密消息时发生错误
   */
  public static DecryptAESError = -40007;

  /**
   * -40008 非法缓冲区
   */
  public static IllegalBuffer = -40008;

  /**
   * -40009 将数据编码为 Base64 字符串时发生错误
   */
  public static EncodeBase64Error = -40009;

  /**
   * -40010 将 Base64 字符串解码为数据时发生错误
   */
  public static DecodeBase64Error = -40010;

  /**
   * -40011 生成返回结果的 XML 时发生错误
   */
  public static GenReturnXmlError = -40011;
}
export function getErrorMsg(code: number): string {
  switch (code) {
    case ErrorCode.OK:
      return "操作成功";

    case ErrorCode.ValidateSignatureError:
      return "验证签名时发生错误";

    case ErrorCode.ParseXmlError:
      return "解析 XML 时发生错误";

    case ErrorCode.ComputeSignatureError:
      return "计算签名时发生错误";

    case ErrorCode.IllegalAesKey:
      return "非法 AES 密钥";

    case ErrorCode.ValidateAppidError:
      return "验证 AppId 失败";

    case ErrorCode.EncryptAESError:
      return "加密消息时发生错误";

    case ErrorCode.DecryptAESError:
      return "解密消息时发生错误";

    case ErrorCode.IllegalBuffer:
      return "非法缓冲区";

    case ErrorCode.EncodeBase64Error:
      return "将数据编码为 Base64 字符串时发生错误";

    case ErrorCode.DecodeBase64Error:
      return "将 Base64 字符串解码为数据时发生错误";

    case ErrorCode.GenReturnXmlError:
      return "生成返回结果的 XML 时发生错误";

    default:
      return "未知错误";
  }
}
