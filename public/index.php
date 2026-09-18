<?php

declare(strict_types=1);

$environment = getenv('APP_ENV') ?: 'local';
$pdo_pgsql_available = extension_loaded('pdo_pgsql');

?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyDevLab</title>
</head>
<body>
    <main>
        <h1>MyDevLab</h1>
        <p>Development environment is running successfully.</p>
        <p>Environment: <?= htmlspecialchars($environment, ENT_QUOTES, 'UTF-8') ?></p>
        <p>PHP: <?= htmlspecialchars(PHP_VERSION, ENT_QUOTES, 'UTF-8') ?></p>
        <h2>PostgreSQL Driver</h2>
        <p>PDO_PGSQL: <?= $pdo_pgsql_available ? 'Available' : 'Unavailable' ?></p>
    </main>
</body>
</html>
