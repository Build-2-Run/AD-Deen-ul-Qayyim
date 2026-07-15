const fs = require('fs');
const path = require('path');

const filesToPatch = [
    'history.html', 'qurbani.html', 'calendar.html', 'orrery.html', 
    'market.html', 'pillars.html', 'asmaul-husna.html', 'ramadan.html', 
    'qibla.html', 'duas.html', 'salat-tracker.html', 'sections.html', 
    'nature-divine.html'
];

const dir = 'c:/Users/meeru/OneDrive/Documents/Antigravity/islamic-hub';

filesToPatch.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${file}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');

    // Patch 1: Delete cursor CSS block
    // Using regex to match the exact block provided by the user
    // It's possible whitespace/newlines differ slightly, so we construct a flexible regex.
    const cssRegex = /#cursor-dot\s*\{[\s\S]*?body\s*\{\s*cursor:\s*none;\s*\}/i;
    content = content.replace(cssRegex, '');

    // Patch 2: Add nav-fix + tilt CSS
    // Let's add it right before </style>
    const patch2CSS = `
.nav-brand { flex-shrink:0; white-space:nowrap; }
.nav-brand .brand-en { display:inline; }
@media(max-width:480px){ .nav-brand .brand-en { display:none; } }
`;
    if (!content.includes('.nav-brand .brand-en { display:inline; }')) {
        content = content.replace('</style>', patch2CSS + '</style>');
    }

    // Patch 3: Delete 3 lines after body
    const divsRegex = /<div id="cursor-dot"><\/div>\s*<div id="cursor-ring"><\/div>\s*<canvas id="sparkle-canvas"><\/canvas>/i;
    content = content.replace(divsRegex, '');

    // Patch 4: Fix nav brand line
    const oldBrand = /<a href="index\.html" class="nav-brand"><span class="brand-arabic">الدِّين<\/span>\s*AD-Deen ul-Qayyim<\/a>/g;
    const newBrand = '<a href="index.html" class="nav-brand"><span class="brand-arabic">الدِّين</span><span class="brand-en">AD-Deen ul-Qayyim</span></a>';
    content = content.replace(oldBrand, newBrand);

    // Patch 5: Delete Canvas Sparkle Script
    // Look for "// Canvas Sparkle script" up to "// NAV TOGGLE" or end of script block
    const sparkleScriptRegex = /\/\/\s*Canvas Sparkle script[\s\S]*?(?=\/\/\s*NAV TOGGLE|<\/script>)/i;
    content = content.replace(sparkleScriptRegex, '');

    // Patch 6: Add 3D card tilt script
    const tiltScript = `
// 3D tilt for cards
document.querySelectorAll('.card').forEach(card => {
card.addEventListener('mousemove', e => {
const rect = card.getBoundingClientRect();
const x = e.clientX - rect.left, y = e.clientY - rect.top;
const ax = -(y - rect.height/2) / (rect.height/2) * 6;
const ay = (x - rect.width/2) / (rect.width/2) * 6;
card.style.transform = \`perspective(1000px) rotateX(\${ax}deg) rotateY(\${ay}deg) translateY(-2px)\`;
});
card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)'; });
});
`;
    // Add it after // NAV TOGGLE block
    // We can just append it before </script>
    if (!content.includes('3D tilt for cards')) {
        content = content.replace(/<\/script>\s*<\/body>/, tiltScript + '\n</script>\n</body>');
    }

    // Patch 7: Orbitron font
    const oldFont = '&family=Outfit:wght@300;400;600;700;800&display=swap';
    const newFont = '&family=Outfit:wght@300;400;600;700;800&family=Orbitron:wght@600;700;800&display=swap';
    content = content.replace(oldFont, newFont);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Patched ${file}`);
});
