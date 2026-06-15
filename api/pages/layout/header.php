<!DOCTYPE html>
<html lang="id">

<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Dashboard Admin - Masjid Ar-Razzaq</title>
   <script src="https://cdn.tailwindcss.com"></script>
   <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" rel="stylesheet">
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
      rel="stylesheet">
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
   <link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/odometer.js/0.4.8/themes/odometer-theme-default.min.css" />
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
   <link href="https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css" rel="stylesheet">
   <link rel="stylesheet" href="layout/calender_style.css">
   <style>
      :root {
         --v-bg: #000000;
         --v-card: #0a0a0a;
         --v-border: #1f1f1f;
         --v-text-main: #ffffff;
         --v-text-muted: #a1a1a1;
         --v-blue: #0070f3;
         --v-success: #10b981;
         --v-error: #ef4444;
      }

      body {
         font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
         background-color: var(--v-bg);
         color: var(--v-text-main);
         letter-spacing: -0.02em;
      }

      /* Scrollbar Minimalist */
      ::-webkit-scrollbar {
         width: 5px;
      }

      ::-webkit-scrollbar-track {
         background: var(--v-bg);
      }

      ::-webkit-scrollbar-thumb {
         background: #333;
         border-radius: 10px;
      }

      .sidebar {
         min-height: calc(100vh - 64px);
      }

      @media print {

         nav,
         aside,
         button {
            display: none !important;
         }

         * {
            animation: none !important;
            transition: none !important;
            transform: none !important;
            box-shadow: none !important;
            text-shadow: none !important;
         }

         body {
            background: #fff !important;
            color: #000 !important;
         }

         nav,
         .soft-card,
         .main-container {
            backdrop-filter: none !important;
         }

      }

      .swal2-popup.swal-gold {

         border: 1px solid rgba(255, 255, 255, 0.06);
         border-left: 3px solid #eab308;

         border-radius: 18px;

         background: rgba(24, 24, 27, 0.38) !important;

         -webkit-backdrop-filter: blur(22px) saturate(180%);
         backdrop-filter: blur(22px) saturate(180%);

         box-shadow:
            0 10px 40px rgba(0, 0, 0, 0.7),
            0 0 25px rgba(234, 179, 8, 0.08);

         overflow: hidden;
      }

      @keyframes fadeUp {

         from {
            opacity: 0;
            transform: translateY(20px);
         }

         to {
            opacity: 1;
            transform: translateY(0);
         }
      }

      .fade-up {

         animation:
            fadeUp 3s cubic-bezier(0.19, 1, 0.22, 1);
      }

      .swal-gold {
         max-width: 82vw !important;
         padding: 10px 12px !important;
         border-radius: 14px !important;
         border: 1px solid rgba(234, 179, 8, 0.12);
      }

      .logout-popup {
         margin: auto !important;
      }

      .logout-button {
         width: 300px !important;
         max-width: 90vw !important;
         margin: auto !important;
      }

      .swal2-loader {
         border-color: #eab308 transparent #eab308 transparent !important;
      }

      @media (max-width: 640px) {

         .swal2-popup.swal-gold {
            width: 90vw !important;
            min-height: unset !important;
            padding: 10px 12px !important;
         }
r
         .swal2-popup.swal-toast {
            width: 78vw !important;
            min-height: unset !important;
            padding: 10px 12px !important;
            margin-top: 8px !important;
         }

         .swal2-title {
            font-size: 13px !important;
            margin: 0 !important;
         }

         .swal2-html-container {
            font-size: 11px !important;
            line-height: 1.4 !important;
            margin: 2px 0 0 !important;
         }

         .swal2-icon {
            margin-left: auto !important;
            margin-right: auto !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
         }

         .swal2-timer-progress-bar {
            height: 2px !important;
         }

         .logout-popup {
            width: 300px !important;
            max-width: 90vw !important;
            margin: auto !important;
         }

         .logout-popup .swal2-icon {
            margin-left: auto !important;
            margin-right: auto !important;
         }

         .logout-popup .swal2-title,
         .logout-popup .swal2-html-container {
            text-align: center !important;
         }

      }
   </style>
   <style>
      /* Vercel Industrial Dark Theme */
      :root {
         --v-bg: #000000;
         --v-card: #0a0a0a;
         --v-border: #1f1f1f;
         --v-text-main: #ffffff;
         --v-text-muted: #a1a1a1;
         --v-blue: #0070f3;
         --v-success: #10b981;
         --v-error: #ef4444;
      }

      body {
         font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
         background-color: var(--v-bg);
         color: var(--v-text-main);
         letter-spacing: -0.02em;
      }

      /* Scrollbar Minimalist */
      ::-webkit-scrollbar {
         width: 5px;
      }

      ::-webkit-scrollbar-track {
         background: var(--v-bg);
      }

      ::-webkit-scrollbar-thumb {
         background: #333;
         border-radius: 10px;
      }

      .vercel-card {
         background: var(--v-card);
         border: 1px solid var(--v-border);
         border-radius: 8px;
         transition: border-color 0.2s ease, background 0.2s ease;
      }

      .vercel-card:hover {
         border-color: #333;
      }

      .vercel-label {
         font-size: 10px;
         font-weight: 700;
         text-transform: uppercase;
         letter-spacing: 0.1em;
         color: var(--v-text-muted);
      }

      .btn-vercel-primary {
         background: #fff;
         color: #000;
         font-weight: 600;
         font-size: 13px;
         transition: opacity 0.2s;
      }

      .btn-vercel-primary:hover {
         opacity: 0.8;
      }

      .btn-vercel-secondary {
         background: transparent;
         border: 1px solid var(--v-border);
         color: #fff;
         font-weight: 500;
         font-size: 13px;
         transition: background 0.2s;
      }

      .btn-vercel-secondary:hover {
         background: rgba(255, 255, 255, 0.05);
         border-color: #444;
      }

      /* Glow Effect like Vercel */
      .status-dot {
         height: 8px;
         width: 8px;
         background-color: var(--v-success);
         border-radius: 50%;
         display: inline-block;
         box-shadow: 0 0 8px var(--v-success);
      }
   </style>
   <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
   <script src="https://npmcdn.com/flatpickr/dist/l10n/id.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
   <script src="https://cdn.jsdelivr.net/npm/countup.js@2.8.0/dist/countUp.umd.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/odometer.js/0.4.8/odometer.min.js"></script>
</head>

<body>