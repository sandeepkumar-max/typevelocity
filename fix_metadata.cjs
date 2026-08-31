const fs = require('fs');
let meta = JSON.parse(fs.readFileSync('metadata.json', 'utf8'));

meta.name = "TypeVelocity - Best Online Typing Tutor & Speed Test";
meta.description = "Master your typing speed with TypeVelocity. Free online typing tutor, WPM tests, and typing games for English and Hindi (Mangal). Improve your accuracy today!";

fs.writeFileSync('metadata.json', JSON.stringify(meta, null, 2));
