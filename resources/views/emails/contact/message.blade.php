<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Roznamcha Contact Message</title>
</head>
<body style="font-family: Arial, sans-serif; color: #0f172a;">
    <h1 style="font-size: 20px; margin-bottom: 16px;">New message from Roznamcha contact form</h1>
    <p><strong>Name:</strong> {{ $name }}</p>
    <p><strong>Email:</strong> {{ $email }}</p>
    <p><strong>Subject:</strong> {{ $subjectLine }}</p>
    <hr style="margin: 20px 0;">
    <p style="white-space: pre-wrap;">{{ $messageBody }}</p>
</body>
</html>
