const data = document.getElementById('data');
const horarios = document.getElementById('horarios');
const form = document.getElementById('form-agendamento');

let atual_horario = null;

data.addEventListener('change', async () => {
  const resp = await fetch(`/available?date=${data.value}`);
  const { disponiveis } = await resp.json();
  
  horarios.innerHTML = '';
  // se não há horários disponíveis nesse dia
  if (disponiveis.length === 0) {
    horarios.innerHTML = `<p>Indisponível</p>`;
    return;
  }

  // cria um botão para cada horário disponível no dia
  disponiveis.forEach(h => {
    const btn = document.createElement('button');
    btn.textContent = h;
    btn.onclick = () => {
      atual_horario = h;
      document.getElementById('horario-atual').innerHTML = `<p>Horário selecionado: ${atual_horario}</p>`;
    }
    horarios.appendChild(btn);
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;

  const resp = await fetch('/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date: data.value, time: atual_horario, name: nome })
  });

  const resultado = await resp.json();
  if (resp.ok) {
    alert(`${resultado.name} foi agendado com sucesso para ${resultado.date} às ${resultado.time}`);
  } else {
    alert(`Erro: ${resultado.erro}`);
  }

  res.redirect('back');
});