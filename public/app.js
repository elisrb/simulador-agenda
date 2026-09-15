const data = document.getElementById('data');
const horarios = document.getElementById('horarios');
const form = document.getElementById('form-agendamento');
const btnSubmit = document.getElementById('confirmar');
const btnVisualizar = document.getElementById('visualizar');
const agenda = document.getElementById('agenda');
const horarioAtual = document.getElementById('horario-atual');

let atual_horario = null;

function reset() {
  horarioAtual.innerHTML = '';
  horarios.innerHTML = '';
  agenda.innerHTML = '';
  atual_horario = null;
}

data.addEventListener('change', async () => {
  const resp = await fetch(`/available?date=${data.value}`, { method: 'GET' });
  const resultado = await resp.json();

  reset();

  // se não há horários disponíveis nesse dia
  if (resultado.disponiveis.length === 0) horarios.innerHTML = `<p>Indisponível</p>`;
  else {
    // cria um botão para cada horário disponível no dia
    resultado.disponiveis.forEach(h => {
      const btn = document.createElement('button');
      btn.textContent = h;
      btn.type = "button";
      btn.onclick = () => {
        atual_horario = h;
        horarioAtual.innerHTML = `<p>Selecionado: ${atual_horario}</p>`;
      }
      horarios.appendChild(btn);
    });
  }
});

btnSubmit.onclick = async () => {
  const nome = document.getElementById('nome').value;

  const resp = await fetch('/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date: data.value, time: atual_horario, name: nome })
  });
  const resultado = await resp.json();

  if (resp.ok) {
    alert(`${resultado.name} foi agendado com sucesso para ${resultado.date} às ${resultado.time}`);
    reset();
    form.reset();
  } else alert(`Erro: ${resultado.erro}`);
};

btnVisualizar.onclick = async () => {
  const resp = await fetch('/appointments', { method: 'GET' });
  const agendamentos = await resp.json();

  reset();

  agendamentos.forEach(a => {
    const item = document.createElement('p');
    item.textContent = `${a.name}: ${a.date} às ${a.time}`;
    agenda.appendChild(item);
  });
}