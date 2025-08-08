import http from 'k6/http';
import { check, sleep } from 'k6';
import encoding from 'k6/encoding';

export let options = {
  vus: 1,
  iterations: 3,
};

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = encoding.b64decode(base64, 'utf-8');
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao parsear JWT:', error, 'Token:', token);
    return null;
  }
}

export default function () {
  const email = `user${Math.floor(Math.random() * 10000)}@test.com`;
  const password = 'jonnathas1234';

  // Criar usuário
  const createUserRes = http.post(
    'http://localhost:3001/users',
    JSON.stringify({
      name: 'Test User',
      email,
      password,
      bornDate: '1997-12-12',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  check(createUserRes, {
    'Usuário criado ou já existia': (r) => r.status === 201 || r.status === 409,
  });

  // Login
  const loginRes = http.post(
    'http://localhost:3001/auth/login',
    JSON.stringify({
      email,
      password,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const token = loginRes.json('access_token');
  const payload = parseJwt(token);
  const userId = payload._id;

  check(loginRes, {
    'Login OK': (r) => r.status === 201,
    'Token recebido': () => !!token,
    'Payload ok': () => !!payload,
  });

  if (!token || !payload) {
    console.error('Login falhou, abortando teste');
    return;
  }

  // Criar produto (sem userId no corpo)
  const productPayload = {
    name: 'Produto Teste',
    description: 'Criado no teste k6 simples',
    stock: 10,
    productStatus: 'AVAILABLE',
  };

  const createProductRes = http.post(
    'http://localhost:3001/products',
    JSON.stringify(productPayload),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log('Status criação produto:', createProductRes.status);
  console.log('Headers:', JSON.stringify(createProductRes.headers));
  console.log('Body criação produto:', createProductRes.body);

  check(createProductRes, {
    'Produto criado': (r) => r.status === 201,
  });

  sleep(1);
}
