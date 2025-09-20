<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

require 'vendor/autoload.php'; // Path to autoload.php from PHPMailer

// Your email configuration
$receiving_email_address = 'jumilandelapenaece@gmail.com';
$smtp_host = 'smtp.gmail.com'; // For Gmail
$smtp_username = 'your-email@gmail.com'; // Your Gmail address
$smtp_password = 'your-app-specific-password'; // Your Gmail App Password
$smtp_port = 587;

// Get form data
$name = isset($_POST['name']) ? $_POST['name'] : '';
$email = isset($_POST['email']) ? $_POST['email'] : '';
$subject = isset($_POST['subject']) ? $_POST['subject'] : '';
$message = isset($_POST['message']) ? $_POST['message'] : '';
$phone = isset($_POST['phone']) ? $_POST['phone'] : 'Not provided';

// Validate required fields
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode([
        'success' => false,
        'message' => 'Please fill in all required fields.'
    ]);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid email address.'
    ]);
    exit;
}

try {
    $mail = new PHPMailer(true);

    // Server settings
    $mail->isSMTP();
    $mail->Host = $smtp_host;
    $mail->SMTPAuth = true;
    $mail->Username = $smtp_username;
    $mail->Password = $smtp_password;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $smtp_port;

    // Recipients
    $mail->setFrom($smtp_username, 'Portfolio Contact Form');
    $mail->addAddress($receiving_email_address);
    $mail->addReplyTo($email, $name);

    // Content
    $mail->isHTML(true);
    $mail->Subject = "New Contact Form Message: $subject";
    
    // Prepare email content
    $email_content = "
    <h2>You have received a new message from your website contact form.</h2>
    <p><strong>Name:</strong> $name</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Phone:</strong> $phone</p>
    <p><strong>Subject:</strong> $subject</p>
    <p><strong>Message:</strong><br>$message</p>
    ";
    
    $mail->Body = $email_content;
    $mail->AltBody = strip_tags($email_content);

    $mail->send();
    echo json_encode([
        'success' => true,
        'message' => 'Your message has been sent. Thank you!'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Message could not be sent. Error: ' . $mail->ErrorInfo
    ]);
}
?>
