import fs from 'fs';

const sections = JSON.parse(fs.readFileSync('scripts/sections.json', 'utf8'));

// Helper to extract blocks by auditor
// Section 1: Workload
// Section 2: SoD
// Section 3: Skills

function parseBlockUnits(headerLine) {
  const parts = headerLine.split(',').map(s => s.trim());
  const units = [];
  for (let i = 2; i < parts.length; i++) {
    const text = parts[i];
    if (text) {
      const match = text.match(/^(\d+)\s*(.+)$/);
      if (match) {
        units.push({ id: parseInt(match[1]), name: match[2].trim(), colIndex: i });
      }
    }
  }
  return units;
}

// 1. Parse SoD (Section 2)
const sodSection = sections[1]; // wait, let's verify which section is which
console.log("Section 0 header:", sections[0].slice(0, 200));
console.log("Section 1 header:", sections[1].slice(0, 200));
console.log("Section 2 header:", sections[2].slice(0, 200));
console.log("Section 3 header:", sections[3].slice(0, 200));
