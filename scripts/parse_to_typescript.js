import fs from 'fs';

const sections = JSON.parse(fs.readFileSync('scripts/sections.json', 'utf8'));

// Section 1: Workload
// Section 2: SoD
// Section 3: Skills

const wlText = sections[1];
const sodText = sections[2];
const skText = sections[3];

// 1. Parse SoD
// In SoD, each block has:
// Line with auditor name (e.g. พี่ตูน)
// Line: ที่,ประเด็นสำรวจ,<unit 1>,,<unit 2>,,...
// Line: ,,มี,ไม่มี,มี,ไม่มี,...
// Lines 1-10: <id>,<question>,<มี/ไม่มี pairs>

function parseSod(text) {
  const sodMap = {}; // unitId -> { 1..10: 'มี' | 'ไม่มี' | '' }
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let currentUnits = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(',');
    if (parts[0] === 'ที่' && parts[1]?.includes('ประเด็นสำรวจ')) {
      currentUnits = [];
      for (let c = 2; c < parts.length; c += 2) {
        const uText = parts[c]?.trim();
        if (uText) {
          const match = uText.match(/^(\d+)/);
          if (match) {
            currentUnits.push({ id: parseInt(match[1]), colIndex: c });
          }
        }
      }
      console.log("SoD block found units:", currentUnits.map(u => u.id));
    } else if (currentUnits.length > 0 && /^\d+$/.test(parts[0])) {
      const qId = parseInt(parts[0]);
      if (qId >= 1 && qId <= 10) {
        currentUnits.forEach((u, idx) => {
          if (!sodMap[u.id]) sodMap[u.id] = {};
          const colYes = u.colIndex;
          const colNo = u.colIndex + 1;
          const yesVal = parts[colYes]?.trim();
          const noVal = parts[colNo]?.trim();
          if (yesVal === '1' || yesVal === '/' || yesVal === 'มี') {
            sodMap[u.id][qId] = 'มี';
          } else if (noVal === '1' || noVal === '/' || noVal === 'ไม่มี') {
            sodMap[u.id][qId] = 'ไม่มี';
          } else {
            sodMap[u.id][qId] = '';
          }
        });
      }
    }
  }
  return sodMap;
}

// 2. Parse Skills
function parseSkills(text) {
  const skMap = {};
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let currentUnits = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(',');
    if (parts[0] === 'ที่' && parts[1]?.includes('ประเด็นสำรวจ')) {
      currentUnits = [];
      for (let c = 2; c < parts.length; c += 2) {
        const uText = parts[c]?.trim();
        if (uText) {
          const match = uText.match(/^(\d+)/);
          if (match) {
            currentUnits.push({ id: parseInt(match[1]), colIndex: c });
          }
        }
      }
      console.log("Skills block found units:", currentUnits.map(u => u.id));
    } else if (currentUnits.length > 0 && /^\d+$/.test(parts[0])) {
      const qId = parseInt(parts[0]);
      if (qId >= 1 && qId <= 6) {
        currentUnits.forEach((u, idx) => {
          if (!skMap[u.id]) skMap[u.id] = {};
          const colYes = u.colIndex;
          const colNo = u.colIndex + 1;
          const yesVal = parts[colYes]?.trim();
          const noVal = parts[colNo]?.trim();
          if (yesVal === '1' || yesVal === '/' || yesVal === 'มี') {
            skMap[u.id][qId] = 'มี';
          } else if (noVal === '1' || noVal === '/' || noVal === 'ไม่มี') {
            skMap[u.id][qId] = 'ไม่มี';
          } else {
            skMap[u.id][qId] = '';
          }
        });
      }
    }
  }
  return skMap;
}

// 3. Parse Workload
// Each unit has 4 columns: [จำนวนผู้ปฏิบัติงาน, ปริมาณงานโดยประมาณ, เพียงพอ, ไม่เพียงพอ]
function parseWorkload(text) {
  const wlMap = {};
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let currentUnits = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(',');
    if (parts[0] === 'ที่' && parts[1]?.includes('ประเด็นสำรวจ')) {
      currentUnits = [];
      for (let c = 2; c < parts.length; c += 4) {
        const uText = parts[c]?.trim();
        if (uText) {
          const match = uText.match(/^(\d+)/);
          if (match) {
            currentUnits.push({ id: parseInt(match[1]), colIndex: c });
          }
        }
      }
      console.log("Workload block found units:", currentUnits.map(u => u.id));
    } else if (currentUnits.length > 0 && /^\d+$/.test(parts[0])) {
      const fId = parseInt(parts[0]);
      if (fId >= 1 && fId <= 5) {
        currentUnits.forEach(u => {
          if (!wlMap[u.id]) wlMap[u.id] = {};
          const cStaff = u.colIndex;
          const cVol = u.colIndex + 1;
          const cAdeq = u.colIndex + 2;
          const cInadeq = u.colIndex + 3;

          const staffRaw = parts[cStaff]?.trim();
          const volRaw = parts[cVol]?.trim();
          const adeqRaw = parts[cAdeq]?.trim();
          const inadeqRaw = parts[cInadeq]?.trim();

          let staffCount = '';
          if (staffRaw && !isNaN(parseInt(staffRaw))) {
            staffCount = parseInt(staffRaw);
          }

          let adequacy = '';
          if (adeqRaw === '1' || adeqRaw === '/' || adeqRaw === 'เพียงพอ') {
            adequacy = 'เพียงพอ';
          } else if (inadeqRaw === '1' || inadeqRaw === '/' || inadeqRaw === 'ไม่เพียงพอ') {
            adequacy = 'ไม่เพียงพอ';
          }

          let workloadVolume = volRaw || '';
          // If volRaw is "เพียงพอ" or "ไม่เพียงพอ", and adequacy was not set, adjust
          if (volRaw === 'เพียงพอ') {
            workloadVolume = '';
            adequacy = 'เพียงพอ';
          } else if (volRaw === 'ไม่เพียงพอ') {
            workloadVolume = '';
            adequacy = 'ไม่เพียงพอ';
          }

          wlMap[u.id][fId] = {
            staffCount,
            workloadVolume,
            adequacy,
            issues: ''
          };
        });
      }
    }
  }
  return wlMap;
}

const sodData = parseSod(sodText);
const skData = parseSkills(skText);
const wlData = parseWorkload(wlText);

console.log("Parsed SoD units:", Object.keys(sodData).length);
console.log("Parsed Skills units:", Object.keys(skData).length);
console.log("Parsed Workload units:", Object.keys(wlData).length);

fs.writeFileSync('scripts/parsed_result.json', JSON.stringify({ sodData, skData, wlData }, null, 2));
