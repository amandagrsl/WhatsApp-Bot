function checkStatus() {
  fetch('http://localhost:3000/status')
    .then(res => res.json())
    .then(data => {
      const statusElement = document.getElementById('status');
      statusElement.innerText = data.status;
      
      statusElement.style.color = data.status === 'Conectado' ? '#25D366' : 'red';
      statusElement.style.fontWeight = 'bold';
    })
    .catch(err => {
      console.error('Erro ao buscar status:', err);
      document.getElementById('status').innerText = 'Erro ao conectar';
    });
}

function carregarAtendimentos() {
  fetch('http://localhost:3000/atendimentos')
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById('lista-clientes');
      if (!lista) return;

      lista.innerHTML = ''; 

      if (!data.clientes || data.clientes.length === 0) {
        lista.innerHTML = '<li style="color: #888;">🔍 Nenhum cliente em espera...</li>';
        return;
      }

      data.clientes.forEach(cliente => {
        const li = document.createElement('li');
        li.style.padding = "12px";
        li.style.marginBottom = "8px";
        li.style.borderLeft = "5px solid #25D366";
        li.style.backgroundColor = "#fdfdfd";
        li.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
        li.style.listStyle = "none";
        
        li.innerHTML = `
          <div style="font-weight: bold; color: #333;">${cliente}</div>
          <div style="font-size: 0.8em; color: #666;">Status: Aguardando Humano</div>
        `;
        lista.appendChild(li);
      });
    })
    .catch(err => console.error('Erro no monitoramento:', err));
}

setInterval(() => {
  checkStatus();
  carregarAtendimentos();
}, 3000);

checkStatus();
carregarAtendimentos();
