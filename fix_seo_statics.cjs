const fs = require('fs');

// 1. Fix robots.txt
let robots = fs.readFileSync('public/robots.txt', 'utf8');
robots = robots.replace(/typevelocity\.com/g, 'typevelocity.in');
fs.writeFileSync('public/robots.txt', robots);

// 2. Fix sitemap.xml
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://typevelocity.in/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://typevelocity.in/practice</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://typevelocity.in/meteor</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://typevelocity.in/sprint</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://typevelocity.in/guide</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://typevelocity.in/about</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://typevelocity.in/privacy</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://typevelocity.in/terms</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>`;
fs.writeFileSync('public/sitemap.xml', sitemap);

// 3. Fix index.html
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/typevelocity\.com/g, 'typevelocity.in');
if (!html.includes('<meta name="robots"')) {
    html = html.replace('<title>', '<meta name="robots" content="index, follow" />\n    <title>');
}
fs.writeFileSync('index.html', html);

console.log('Fixed statics');
