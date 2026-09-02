const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<h2 className="text-3xl font-bold">About TypeVelocity<\/h2>/, '<h1 className="text-3xl font-bold">About TypeVelocity</h1>');
code = code.replace(/<h2 className="text-3xl font-bold">Help & Support<\/h2>/, '<h1 className="text-3xl font-bold">Help & Support</h1>');
code = code.replace(/<h2 className="text-3xl font-bold mb-4">Contact Us<\/h2>/, '<h1 className="text-3xl font-bold mb-4">Contact Us</h1>');
code = code.replace(/<h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Privacy Policy<\/h2>/, '<h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Privacy Policy</h1>');
code = code.replace(/<h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Terms & Conditions<\/h2>/, '<h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Terms & Conditions</h1>');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed H1 tags in App.tsx');
