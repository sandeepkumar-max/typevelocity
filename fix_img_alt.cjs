const fs = require('fs');
let header = fs.readFileSync('src/components/Header.tsx', 'utf8');
header = header.replace(/alt="User"/, 'alt={user.displayName || "User profile picture"}');
fs.writeFileSync('src/components/Header.tsx', header);

let profile = fs.readFileSync('src/components/UserProfileModal.tsx', 'utf8');
profile = profile.replace(/alt="Profile"/, 'alt={displayName || "User profile picture"}');
fs.writeFileSync('src/components/UserProfileModal.tsx', profile);
console.log('Fixed img alts');
