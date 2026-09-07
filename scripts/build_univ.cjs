const fs = require('fs');
const path = require('path');

const parts = [
  'part1.json',
  'part2.json',
  'part3.json',
  'part4.json',
  'part5.json',
  'part6.json'
];

let allData = [];

for (const part of parts) {
  const filePath = path.join(__dirname, part);
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(raw);
    console.log(`${part}: ${json.length} items`);
    allData = allData.concat(json);
  } else {
    console.error(`File not found: ${filePath}`);
  }
}

console.log(`Total items collected: ${allData.length}`);

// Convert to UniversityTip format
const formatted = allData.map(item => {
  const major = (item['세부학과'] && item['세부학과'].trim() !== '') 
    ? item['세부학과'].trim() 
    : (item['모집단위'] || '').trim();

  let core = (item['핵심과목'] || '').trim();
  if (core === '-') core = '';

  let recommended = (item['권장과목'] || '').trim();
  if (recommended === '-') recommended = '';

  let note = (item['비고'] || '').trim();
  if (note === '-') note = '';

  return {
    region: item['권역'] || '수도권',
    location: item['지역'] || '',
    university: item['대학명'] || '',
    major: major,
    core: core,
    recommended: recommended,
    note: note || undefined
  };
});

const tsContent = `export interface UniversityTip {
  region: string;
  location: string;
  university: string;
  major: string;
  core: string;
  recommended: string;
  note?: string;
}

export const UNIVERSITY_TIPS: UniversityTip[] = ${JSON.stringify(formatted, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/universityData.ts'), tsContent, 'utf-8');
console.log('Successfully updated /src/data/universityData.ts');
