const http = require('http');

const PORT = 3000; // Production server port

function makeRequest(path, method = 'GET', bodyData = null) {
  return new Promise((resolve, reject) => {
    const postData = bodyData ? JSON.stringify(bodyData) : '';
    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        path,
        method,
        headers: bodyData
          ? {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(postData),
            }
          : {},
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(raw) });
          } catch (e) {
            resolve({ status: res.statusCode, raw });
          }
        });
      }
    );
    req.on('error', (err) => reject(err));
    if (bodyData) req.write(postData);
    req.end();
  });
}

async function runTestSuite() {
  console.log('====================================================');
  console.log(' ASAL YA NAKLI — COMPREHENSIVE FUNCTIONALITY TEST');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  // --- Test 1: Authentic Product Investigation (Panadol 500mg) ---
  try {
    console.log('[TEST 1] Investigating Authentic Product: "Panadol 500mg"...');
    const res = await makeRequest('/api/investigate', 'POST', { query: 'Panadol 500mg' });
    if (res.status === 200 && res.body.id && res.body.riskAssessment) {
      console.log(`  ✓ SUCCESS! ID: ${res.body.id}`);
      console.log(`    DRAP Reg Match: ${res.body.officialMatch?.registrationNumber || 'None'}`);
      console.log(`    Risk Score: ${res.body.riskAssessment.score}/100 (${res.body.riskAssessment.level})`);
      console.log(`    AI Summary: "${res.body.explanation?.summary?.slice(0, 90)}..."`);
      passed++;
    } else {
      console.error('  ❌ FAILED!', res);
      failed++;
    }
  } catch (err) {
    console.error('  ❌ FAILED Error:', err.message);
    failed++;
  }

  // --- Test 2: High Risk Safety Alert Investigation (Augmentin 625mg) ---
  try {
    console.log('\n[TEST 2] Investigating Safety Alert Product: "Augmentin 625mg"...');
    const res = await makeRequest('/api/investigate', 'POST', { query: 'Augmentin 625mg' });
    if (res.status === 200 && res.body.matchingAlerts?.length > 0) {
      console.log(`  ✓ SUCCESS! Matched Safety Alerts: ${res.body.matchingAlerts.length}`);
      console.log(`    Alert Source: ${res.body.matchingAlerts[0].source}`);
      console.log(`    Risk Score: ${res.body.riskAssessment.score}/100 (${res.body.riskAssessment.level})`);
      passed++;
    } else {
      console.error('  ❌ FAILED!', res);
      failed++;
    }
  } catch (err) {
    console.error('  ❌ FAILED Error:', err.message);
    failed++;
  }

  // --- Test 3: Packaging Image OCR Extraction (Vision API) ---
  try {
    console.log('\n[TEST 3] Packaging Image Base64 OCR Analysis...');
    // Minimal 1x1 GIF base64 image representation
    const dummyImageBase64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const res = await makeRequest('/api/investigate', 'POST', {
      query: 'Panadol Packaging',
      imageBase64: dummyImageBase64,
    });
    if (res.status === 200 && res.body.extractedData) {
      console.log(`  ✓ SUCCESS! Extracted Product: ${res.body.extractedData.detectedProductName}`);
      console.log(`    Batch Extracted: ${res.body.extractedData.batchNumber}`);
      console.log(`    Observations Extracted: ${res.body.extractedData.packagingObservations?.length || 0}`);
      passed++;
    } else {
      console.error('  ❌ FAILED!', res);
      failed++;
    }
  } catch (err) {
    console.error('  ❌ FAILED Error:', err.message);
    failed++;
  }

  // --- Test 4: Citizen Community Report Submission ---
  try {
    console.log('\n[TEST 4] Submitting Citizen Community Report...');
    const reportData = {
      productName: 'Panadol 500mg',
      verdict: 'FAKE',
      flags: ['Broken seal', 'Spelling error'],
      city: 'Peshawar',
      batchNumber: 'PK9901',
      note: 'Found altered printing on retail packaging in Peshawar market.',
    };
    const res = await makeRequest('/api/report', 'POST', reportData);
    if (res.status === 200 && res.body.success && res.body.report?.id) {
      console.log(`  ✓ SUCCESS! Report Recorded. ID: ${res.body.report.id}`);
      console.log(`    Total Reports for Product: ${res.body.updatedStats.totalReports}`);
      console.log(`    Fake Verdicts Count: ${res.body.updatedStats.verdictBreakdown.fake}`);
      passed++;
    } else {
      console.error('  ❌ FAILED!', res);
      failed++;
    }
  } catch (err) {
    console.error('  ❌ FAILED Error:', err.message);
    failed++;
  }

  // --- Test 5: Investigation Record Retrieval by Share ID ---
  try {
    console.log('\n[TEST 5] Testing Shareable Investigation Retrieval...');
    const invRes = await makeRequest('/api/investigate', 'POST', { query: 'Brufen 400mg' });
    const invId = invRes.body.id;

    const fetchRes = await makeRequest(`/api/investigations/${invId}`, 'GET');
    if (fetchRes.status === 200 && fetchRes.body.id === invId) {
      console.log(`  ✓ SUCCESS! Share Link Retrieved Record #${invId}`);
      console.log(`    Product Name: ${fetchRes.body.productName}`);
      passed++;
    } else {
      console.error('  ❌ FAILED!', fetchRes);
      failed++;
    }
  } catch (err) {
    console.error('  ❌ FAILED Error:', err.message);
    failed++;
  }

  // --- Test 6: Recent Reports Feed ---
  try {
    console.log('\n[TEST 6] Fetching Recent Reports Feed...');
    const res = await makeRequest('/api/reports/recent', 'GET');
    if (res.status === 200 && Array.isArray(res.body.reports)) {
      console.log(`  ✓ SUCCESS! ${res.body.reports.length} recent community reports retrieved.`);
      passed++;
    } else {
      console.error('  ❌ FAILED!', res);
      failed++;
    }
  } catch (err) {
    console.error('  ❌ FAILED Error:', err.message);
    failed++;
  }

  console.log('\n====================================================');
  console.log(` TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================');
}

runTestSuite();
