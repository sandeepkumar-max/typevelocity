const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const headEndIndex = html.indexOf('</head>');

const seoTags = `
    <!-- Primary Meta Tags -->
    <title>TypeVelocity - Best Online Typing Tutor & Speed Test</title>
    <meta name="title" content="TypeVelocity - Best Online Typing Tutor & Speed Test" />
    <meta name="description" content="Master your typing speed with TypeVelocity. Free online typing tutor, WPM tests, and typing games for English and Hindi (Mangal). Improve your accuracy today!" />
    <meta name="keywords" content="typing test, typing speed test, typing tutor, learn typing, english typing test, hindi typing test, mangal font typing, typevelocity, wpm test, improve typing speed, touch typing practice" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://typevelocity.com/" />
    <meta property="og:title" content="TypeVelocity - Best Online Typing Tutor & Speed Test" />
    <meta property="og:description" content="Master your typing speed with TypeVelocity. Free online typing tutor, WPM tests, and typing games for English and Hindi (Mangal). Improve your accuracy today!" />
    <meta property="og:image" content="https://typevelocity.com/preview.png" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://typevelocity.com/" />
    <meta property="twitter:title" content="TypeVelocity - Best Online Typing Tutor & Speed Test" />
    <meta property="twitter:description" content="Master your typing speed with TypeVelocity. Free online typing tutor, WPM tests, and typing games for English and Hindi (Mangal). Improve your accuracy today!" />
    <meta property="twitter:image" content="https://typevelocity.com/preview.png" />

    <!-- Canonical URL -->
    <link rel="canonical" href="https://typevelocity.com/" />

    <!-- Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "TypeVelocity",
      "url": "https://typevelocity.com",
      "description": "A highly interactive typing practice application with mini-games, English & Hindi typing courses, and real-time WPM stats.",
      "applicationCategory": "EducationalApplication",
      "genre": "Typing Tutor",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
    </script>
`;

const updatedHtml = html.replace(/<title>.*?<\/title>/, '').replace('</head>', seoTags + '  </head>');

fs.writeFileSync('index.html', updatedHtml);
