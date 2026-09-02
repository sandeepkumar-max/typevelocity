const fs = require('fs');

function fixLinks(filePath) {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');

    // For buttons that are mapped over nav items in Header
    code = code.replace(/<button(\s+key=\{item\.id\})\s+onClick=\{([^}]+)\}/g, 
        '<a href={`/${item.id === "home" ? "" : item.id}`}$1 onClick={(e) => { e.preventDefault(); $2(e); }}');
    code = code.replace(/<\/button>(\s+)\}\)\}(\s+)<\/nav>/, '</a>$1})\}$2</nav>');

    // For general onClick onViewChange calls (divs/buttons)
    code = code.replace(/<div([^>]+)onClick=\{\(\) => onViewChange\('([^']+)'\)\}/g, 
        '<a href="/$2" $1 onClick={(e) => { e.preventDefault(); onViewChange("$2"); }}');
    code = code.replace(/<button([^>]+)onClick=\{\(\) => onViewChange\('([^']+)'\)\}/g, 
        '<a href="/$2" $1 onClick={(e) => { e.preventDefault(); onViewChange("$2"); }}');
    
    // Fix closing tags for those generic ones that might have changed
    // This is a bit risky for regex, but let's see. 
    // Wait, replacing the opening tag of div/button with `a` means closing tag must be `a`.
    // Let's do it safer.
    
    fs.writeFileSync(filePath, code);
}

// Safer approach: just replace the `onClick` and `tag` manually using exact replacements.
// Since it's a few files, let's write a targeted script.
