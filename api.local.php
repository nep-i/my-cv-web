
<?php
require __DIR__ . '/website/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

$servername = $_ENV['DB_HOST'];
$username = $_ENV['DB_USER'];
$password = '';
$dbname = $_ENV['DB_NAME'];

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$input = json_decode(file_get_contents("php://input"), true);
$input_password = isset($input['password']) ? $input['password'] : '';
$hashed_password = password_hash($input_password, PASSWORD_DEFAULT);
$sql = "SELECT pass FROM about WHERE id = 0"; 
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $stored_password = $row['pass'];
} else {
    $response = [
        'status' => 'error',
        'message' => 'Password not found in the database.'
    ];
    echo json_encode($response);
    exit();
}

$response = [];
if ($input_password === $stored_password) {
    $sql = "SELECT * FROM about WHERE id = 0"; 
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $name = isset($row['name']) ? $row['name'] : null;
        $phone = isset($row['phone']) ? $row['phone'] : null;   
        $address = isset($row['address']) ? $row['address'] : null; 
        $email = isset($row['email']) ? $row['email'] : null; 

        $response = [
            'status' => 'success',
            'ima' => $name,
            'numberuno' => $phone,
            'theplace' => $address,
            'pochtovik' => $email,    
            'description' => 'I started programming in the Pascal around year 2000 but
                stopped because my life took a different direction. Now I\'m glad
                to be able to pursue programming as a profession and it\'s social
                applications. In my experience the line between
                Front/Backend, DevOps, Management and Security was blurred, so
                being mostly practicing problem solution in the required field
                that comes on my way.',         
            'education' => [['2021 - 2023', 'Graduated PXL Full Stack Graduateprogrammeren - Hasselt, Belgium'],
            ],
            'experience' => [
                ['2023 - 2024', 'Inuits - Full stack - Development Web Applaication for anonimous voting and sharing opininions. Laying down Ci/CD, pipelines, maintaning mobile app, observability and maintenance of performance of container in Nomad. Mainly worked with React/ReactNative Python Django Terraform Bash & GitLab '],
                ['2022 - 2023', 'Internship at iDA Mediafoundry - Project development of Engagement Monitor. The monitor registers the level of engagement in a conversation.']
            ],
            'skills' => [
                ['Languages & Frameworks:', 'C# .NET Java TypeScript React/Native Vue Python Flask Django'],
                ['DevOps:', 'Nomad GitLab AWS Azure Consul Terraform Vault Docker'],
                ['Databases:', 'SQL MySql Firebase PL/SQL'],
                ['OS:', 'Linux Windows Android'],
                ['Was in touch with:', 'OpenCV NumPy Matplotlib SciKit TensorFlow PHP'],
                ['Security & IM:', 'OAuth 2.0 KeyCloak AWS'],
                ['Architecture:', 'MVC MVVM Microservices'],
            ],
            'qualities' => [
                ['Describing one’s own qualities can often feel subjective, even egoistic, as it’s difficult to fully see ourselves through others’ eyes. I think the real question is how would YOU find working with me ? However, my perception of my self in a workplaces is: being flexible, analytical, honest, attentive, communicative and driven.'],
                ['Enjoying taking initiative and change, as being a part of life itself. I approach problems analytically, manage my tasks independently or in group based on a workflow, and strive for concrete results while embracing creativity and help whenever I recognize being stuck within an given timeframe or means.'],
                ['Familiar with Agile and Kaizen, I support communities where everyone can suggest and speak honestly about any issue.'],
            ]
        ];
        
    } else {
        $response = [
            'status' => 'error',
            'message' => 'fuck you'
        ];
    }
} else {
    $response = [
        'status' => 'error',
        'message' => 'Incorrect password.'
    ];
}

echo json_encode($response);

$conn->close();
?>
