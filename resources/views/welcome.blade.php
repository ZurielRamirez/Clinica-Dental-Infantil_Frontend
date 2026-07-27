<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clinica dental infantil</title>
    <link rel="icon" type="image/png" href="{{ asset('logo.png') }}">
    @viteReactRefresh
   @vite(['resources/js/app.jsx', 'resources/css/app.css'])
</head>
<body class="bg-gray-50 text-gray-800">
    <div id="app"></div>
</body>
</html>