const http = require('http');

const data = JSON.stringify({ query: 'Augmentin 625mg' });

const req = http.request(
  {
    hostname: 'localhost',
    port: 3001,
    path: '/api/investigate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  },
  (res) => {
    let body = '';
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => {
      console.log('API Status Code:', res.statusCode);
      const parsed = JSON.parse(body);
      console.log('Investigation ID:', parsed.id);
      console.log('Risk Score:', parsed.riskAssessment?.score, 'Level:', parsed.riskAssessment?.level);
      console.log('AI Explanation Headline:', parsed.explanation?.headline);
      console.log('AI Explanation Summary:', parsed.explanation?.summary);
    });
  }
);

req.on('error', (e) => console.error('Req error:', e));
req.write(data);
req.end();
