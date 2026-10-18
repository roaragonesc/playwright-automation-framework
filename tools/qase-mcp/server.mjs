import { createInterface } from 'node:readline';

const token = process.env.QASE_READER_TOKEN;
const project = process.env.QASE_PROJECT_CODE || 'AEQA';
const apiBase = 'https://api.qase.io/v1';

async function qaseGet(path) {
  if (!token) throw new Error('Falta la variable de entorno QASE_READER_TOKEN');
  const response = await fetch(`${apiBase}${path}`, {
    headers: { Token: token, Accept: 'application/json' }
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Qase HTTP ${response.status}: ${body.slice(0, 500)}`);
  const json = JSON.parse(body);
  if (json.status === false) throw new Error(json.errorMessage || 'Error de Qase');
  return json.result;
}

const tools = [
  { name: 'qase_list_cases', description: 'Lista casos de prueba documentados en Qase (solo lectura), con paginación.', inputSchema: { type: 'object', properties: { limit: { type: 'integer', minimum: 1, maximum: 100, default: 50 }, offset: { type: 'integer', minimum: 0, default: 0 } }, additionalProperties: false } },
  { name: 'qase_get_case', description: 'Lee el caso documentado AEQA-N de Qase, incluidos sus pasos y resultados esperados.', inputSchema: { type: 'object', properties: { id: { type: 'integer', minimum: 1 } }, required: ['id'], additionalProperties: false } }
];

async function invoke(name, args) {
  if (name === 'qase_list_cases') {
    const limit = Math.max(1, Math.min(100, Number(args.limit ?? 50)));
    const offset = Math.max(0, Number(args.offset ?? 0));
    return qaseGet(`/case/${encodeURIComponent(project)}?limit=${limit}&offset=${offset}`);
  }
  if (name === 'qase_get_case') {
    const id = Number(args.id);
    if (!Number.isSafeInteger(id) || id < 1) throw new Error('El ID debe ser un entero positivo');
    return qaseGet(`/case/${encodeURIComponent(project)}/${id}`);
  }
  throw new Error(`Herramienta desconocida: ${name}`);
}

function reply(id, result, error) {
  if (id === undefined) return;
  const message = error ? { jsonrpc: '2.0', id, error: { code: -32603, message: String(error.message || error) } } : { jsonrpc: '2.0', id, result };
  process.stdout.write(JSON.stringify(message) + '\n');
}

const input = createInterface({ input: process.stdin, crlfDelay: Infinity });
input.on('line', async line => {
  let request;
  try {
    request = JSON.parse(line);
    const { id, method, params = {} } = request;
    if (method === 'initialize') return reply(id, { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'qase-reader', version: '1.0.0' } });
    if (method === 'notifications/initialized') return;
    if (method === 'ping') return reply(id, {});
    if (method === 'tools/list') return reply(id, { tools });
    if (method === 'tools/call') {
      try { const result = await invoke(params.name, params.arguments || {}); return reply(id, { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }); }
      catch (e) { return reply(id, { content: [{ type: 'text', text: e.message }], isError: true }); }
    }
    reply(id, undefined, new Error(`Método no soportado: ${method}`));
  } catch (e) { reply(request?.id, undefined, e); }
});
