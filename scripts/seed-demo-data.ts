import { INITIAL_COMMUNITY_REPORTS } from '../src/lib/store';
import { DRAP_REGISTRY_SEED } from '../src/lib/providers/drap';
import { WHO_ALERTS_SEED } from '../src/lib/providers/who';

console.log('=== ASAL YA NAKLI — DEMO DATA SEED VERIFICATION ===');
console.log(`[DRAP Registry Seed]: ${DRAP_REGISTRY_SEED.length} official product entries.`);
console.log(`[WHO Safety Alerts Seed]: ${WHO_ALERTS_SEED.length} global safety alerts.`);
console.log(`[Community Reports Seed]: ${INITIAL_COMMUNITY_REPORTS.length} Pakistan community reports.`);

console.log('\nDRAP Products Sample:');
DRAP_REGISTRY_SEED.forEach(p => console.log(` - ${p.brandName} (DRAP Reg #${p.registrationNumber}): ${p.status}`));

console.log('\nWHO Alerts Sample:');
WHO_ALERTS_SEED.forEach(a => console.log(` - ${a.source}: ${a.title}`));

console.log('\nSeed Verification Complete!');
