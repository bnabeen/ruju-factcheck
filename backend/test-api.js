// Test script for RUJU Backend API
const testAPI = async () => {
    const baseURL = 'http://localhost:5000';

    console.log('🧪 Testing RUJU Backend API...\n');

    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthRes = await fetch(`${baseURL}/health`);
    const healthData = await healthRes.json();
    console.log('✅ Health:', healthData);
    console.log('');

    // Test 2: Register User
    console.log('2️⃣ Testing User Registration...');
    const registerRes = await fetch(`${baseURL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'test@ruju.com',
            password: 'test123',
            fullName: 'Test User'
        })
    });
    const registerData = await registerRes.json();
    console.log('✅ Register:', registerData.message || registerData.error);
    const token = registerData.token;
    console.log('');

    // Test 3: Verify Text Claim
    console.log('3️⃣ Testing Text Verification...');
    const verifyRes = await fetch(`${baseURL}/api/verify/text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            claim: 'The sky is blue',
            lang: 'EN'
        })
    });
    const verifyData = await verifyRes.json();
    console.log('✅ Verification Result:');
    console.log('   Verdict:', verifyData.verdict);
    console.log('   Confidence:', verifyData.confidence);
    console.log('   Summary:', verifyData.summary);
    console.log('');

    console.log('🎉 All tests completed!');
};

testAPI().catch(console.error);
