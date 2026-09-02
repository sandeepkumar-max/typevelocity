const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Find the start of the bad injection
const startIndex = code.indexOf('  // SEO & Routing Effect');
const endIndex = code.indexOf('  return (', startIndex + 2000);

if (startIndex !== -1 && endIndex !== -1) {
  const badChunk = code.substring(startIndex, endIndex + '  return ('.length);
  
  // The bad chunk starts with "  // SEO & Routing Effect" and ends with "  return (".
  // We need to extract just the hook code.
  const hookCode = code.substring(startIndex, code.lastIndexOf('}, []);') + '}, []);'.length);
  
  // Replace the bad chunk with just `return (` (since `case 'home': ` is right before startIndex)
  code = code.replace(badChunk, 'return (');
  
  // Insert hookCode before renderContent
  code = code.replace("const renderContent = () => {", hookCode + "\n\n  const renderContent = () => {");
  
  fs.writeFileSync('src/App.tsx', code);
  console.log("Fixed hooks placement properly!");
} else {
  console.log("Could not find start or end index.");
}
