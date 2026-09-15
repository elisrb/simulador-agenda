const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const HORARIOS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];

async function diaUtil(data) {
  // fim de semana
  const dia = new Date(data + 'T00:00:00').getDay();
  if (!(dia > 0 && dia < 6)) return false;

  // feriados
  const api = await fetch(`https://date.nager.at/api/v3/PublicHolidays/2026/BR`); // consulta a API
  const api_data = await api.json();
  const feriados = api_data.map(f => f.date);
  if (feriados.includes(data)) return false;

  // se não é um fim de semana nem feriado, é um dia útil
  return true;
}

// endpoint GET /available?date=2026-02-10
app.get('/available', async (req, res) => {
  const { date } = req.query;

  // validação da request
  if (!date) return res.status(400).json({ erro: 'não foi passada uma data' });
  if (!(await diaUtil(date))) return res.json({ date, disponiveis: [] });

  // consulta ao banco de dados
  const row = db.prepare('SELECT time FROM appointments WHERE date = ?').all(date);
  const ocupados = row.map(r => r.time);
  const disp = HORARIOS.filter(h => !ocupados.includes(h));

  return res.json({ date, disponiveis: disp });
});

// POST /appointments
app.post('/appointments', async (req, res) => {
  const { date, time, name } = req.body;

  // validação da request
  if (!date || !time || !name) return res.status(400).json({ erro: 'parâmetros insuficientes' });
  if (!(await diaUtil(date))) return res.status(400).json({ erro: 'data indisponível' });
  if (!HORARIOS.includes(time)) return res.status(400).json({ erro: 'horário inválido' });

  // checa horário
  const jaExiste = db.prepare('SELECT id FROM appointments WHERE date = ? AND time = ?').get(date, time);
  if (jaExiste) return res.status(409).json({ erro: 'conflito de horários' });

  // se o horário está disponível, adiciona o agendamento
  const info = db.prepare('INSERT INTO appointments (date, time, name) VALUES (?, ?, ?)').run(date, time, name);
  return res.status(201).json({ id: info.lastInsertRowid, date, time, name });
});

// GET /appointments
app.get('/appointments', (req, res) => {
  // retorna todas as entradas do banco de dados
  const lista = db.prepare('SELECT * FROM appointments ORDER BY date, time').all();
  return res.json(lista);
});

app.listen(3000, () => console.log('Rodando em http://localhost:3000'));

process.on('SIGINT', function() {
  // adicionar handling do banco de dados para salvar aqui
  process.exit(0);
});