const fs = require('fs');

const content = fs.readFileSync('./scratch_moon.js', 'utf8');

const taMatch = content.match(/const\s+ta\s*=\s*\[([\s\S]*?)\]\n\s*return/);
const tbMatch = content.match(/const\s+tb\s*=\s*\[([\s\S]*?)\]\n\s*return/);

if (taMatch && tbMatch) {
  const taStr = taMatch[1];
  const tbStr = tbMatch[1];

  let ts = `export interface LunarPeriodicTermLR {
  D: number;
  M: number;
  Mprime: number;
  F: number;
  l: number;
  r: number;
}

export interface LunarPeriodicTermB {
  D: number;
  M: number;
  Mprime: number;
  F: number;
  b: number;
}

export const LunarPeriodicTermsLR: LunarPeriodicTermLR[] = [
`;
  
  const taRows = taStr.match(/\[([^\]]+)\]/g);
  for (const row of taRows) {
    const nums = row.replace(/\[|\]/g, '').split(',').map(n => n.trim());
    ts += `  { D: ${nums[0]}, M: ${nums[1]}, Mprime: ${nums[2]}, F: ${nums[3]}, l: ${nums[4]}, r: ${nums[5]} },\n`;
  }
  ts += `];\n\nexport const LunarPeriodicTermsB: LunarPeriodicTermB[] = [\n`;
  
  const tbRows = tbStr.match(/\[([^\]]+)\]/g);
  for (const row of tbRows) {
    const nums = row.replace(/\[|\]/g, '').split(',').map(n => n.trim());
    ts += `  { D: ${nums[0]}, M: ${nums[1]}, Mprime: ${nums[2]}, F: ${nums[3]}, b: ${nums[4]} },\n`;
  }
  ts += `];\n`;

  fs.writeFileSync('./engine/math/LunarPeriodicTerms.ts', ts);
  console.log('Successfully wrote LunarPeriodicTerms.ts');
} else {
  console.log('Failed to match');
}
