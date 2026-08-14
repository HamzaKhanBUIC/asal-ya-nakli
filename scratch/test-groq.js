const Groq = require('groq-sdk');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const match = envContent.match(/GROQ_API_KEY=(.+)/);
const apiKey = match ? match[1].trim() : '';

console.log('Testing Groq Key:', apiKey ? apiKey.substring(0, 10) + '...' : 'Missing');

const groq = new Groq({ apiKey });

async function testGroq() {
  try {
    const res = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Respond with: Asal ya Nakli is ready.' }],
      model: 'llama-3.3-70b-versatile',
    });
    console.log('SUCCESS Response from Groq:', res.choices[0]?.message?.content);
  } catch (err) {
    console.error('Groq Error:', err.message);
  }
}

testGroq();
