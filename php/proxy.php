<?php
// 获取请求方法
$method = $_SERVER['REQUEST_METHOD'];

// Vercel 应用程序的 URL
$url = 'https://*.vercel.app/api/wechat';

// 初始化 cURL
// 构建查询参数字符串并添加到 URL 中
$query = http_build_query($_REQUEST);
if (!empty($query)) {
  $curl = curl_init($url . '?' . $query);
} else {
  $curl = curl_init($url);
}

// 配置 cURL
// 设置超时时间，单位为秒
curl_setopt($curl, CURLOPT_TIMEOUT, 60);
curl_setopt($curl, CURLOPT_TIMEOUT_MS, 60);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HEADER, false);

if ($method === 'POST') {
  // 从请求体中读取原始数据
  $input_data = file_get_contents('php://input');
  // 设置 POST 数据
  curl_setopt($curl, CURLOPT_POST, true);
  curl_setopt($curl, CURLOPT_POSTFIELDS, $input_data);
  // 设置 Content-Type 请求头
  curl_setopt($curl, CURLOPT_HTTPHEADER, [
    'Content-Type: text/xml'
  ]);
  error_log('$input_data: ' . $input_data);
}

// 执行 cURL
$response = curl_exec($curl);

// 输出响应数据到日志
error_log('Response message: ' . $response);

// 检查是否发生错误
if (curl_errno($curl)) {
  $error_msg = curl_error($curl);
  curl_close($curl);
  die('cURL Error: ' . $error_msg);
}

// 关闭 cURL
curl_close($curl);

// 输出响应
echo $response;
?>