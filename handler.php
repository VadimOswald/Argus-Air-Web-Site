<?php

header('Content-Type: application/json');

// ===== CONFIG =====
$token = '8774819549:AAHo3ubjPRQ8_KJZZYMy9wJgciaLQWT_AGA';
$chatId = '265208320';

// ===== RATE LIMIT =====
$ip = $_SERVER['REMOTE_ADDR'];
$limit = 5;
$timeWindow = 60;

$cacheDir = __DIR__ . '/rate_limit';
if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0755, true);
}

$file = $cacheDir . '/' . md5($ip);
$requests = [];

if (file_exists($file)) {
    $requests = json_decode(file_get_contents($file), true) ?? [];
}

$requests = array_filter($requests, function ($t) use ($timeWindow) {
    return $t > time() - $timeWindow;
});

if (count($requests) >= $limit) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Too many requests']);
    exit;
}

$requests[] = time();
file_put_contents($file, json_encode($requests));

// ===== METHOD CHECK =====
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Forbidden']);
    exit;
}

// ===== HONEYPOT =====
if (!empty($_POST['website'])) {
    exit;
}

// ===== TIME CHECK =====
$formTime = $_POST['form_time'] ?? 0;
if (time() - $formTime < 3) {
    exit;
}

// ===== MESSAGE =====
$formType = $_POST['form_type'] ?? $_SERVER['HTTP_REFERER'] ?? 'Форма';

$body = "Новое сообщение\n";
$body .= "━━━━━━━━━━━━━━━━━━━━\n";
$body .= "Источник: $formType\n";
$body .= "━━━━━━━━━━━━━━━━━━━━\n";

foreach ($_POST as $key => $value) {
    if (in_array($key, ['form_type', 'website', 'form_time'])) continue;
    $label = mb_convert_case(str_replace('_', ' ', $key), MB_CASE_TITLE);
    $body .= "$label: $value\n";
}

$body .= "━━━━━━━━━━━━━━━━━━━━\n";
$body .= "🕐 " . date('d.m.Y H:i:s');

// ===== TELEGRAM =====
$url = "https://api.telegram.org/bot{$token}/sendMessage";

$data = [
    'chat_id' => $chatId,
    'text' => $body
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

// ===== RESPONSE =====
if ($httpCode === 200) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}