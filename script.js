const input = document.getElementById("inputTarefa");
const botao = document.getElementById("btnAdicionar");
const lista = document.getElementById("lista");
const totalEl = document.getElementById("total");
const concluidasEl = document.getElementById("concluidas");
const pendentesEl = document.getElementById("pendentes");
const botaoLimpar = document.getElementById("limpar");
const mensagemVazia = document.getElementById("vazio");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function atualizarContador() {
  const total = tarefas.length;

  const concluidas = tarefas.filter(function (tarefa) {
    return tarefa.concluida === true;
  }).length;

  const pendentes = total - concluidas;

  totalEl.innerText = `Total: ${total}`;
  concluidasEl.innerText = `✔ Concluídas: ${concluidas}`;
  pendentesEl.innerText = `⏳ Pendentes: ${pendentes}`;
}

function verificarListaVazia() {
  if (tarefas.length === 0) {
    mensagemVazia.style.display = "block";
  } else {
    mensagemVazia.style.display = "none";
  }
}

function criarTarefaNaTela(tarefa) {
  const item = document.createElement("li");

  const span = document.createElement("span");
  span.innerText = tarefa.texto;

  if (tarefa.concluida) {
    span.classList.add("concluida");
  }

  span.onclick = function () {
    span.classList.toggle("concluida");

    const tarefaEncontrada = tarefas.find(function (itemTarefa) {
      return itemTarefa.id === tarefa.id;
    });

    if (tarefaEncontrada) {
      tarefaEncontrada.concluida = span.classList.contains("concluida");
      salvarTarefas();
      atualizarContador();
      verificarListaVazia();
    }
  };

  const botaoRemover = document.createElement("button");
  botaoRemover.innerText = "Remover";

  botaoRemover.onclick = function () {
    tarefas = tarefas.filter(function (itemTarefa) {
      return itemTarefa.id !== tarefa.id;
    });

    item.remove();
    salvarTarefas();
    atualizarContador();
    verificarListaVazia();
  };

  item.appendChild(span);
  item.appendChild(botaoRemover);
  lista.appendChild(item);
}

function adicionarTarefa() {
  const texto = input.value.trim();

  if (texto === "") {
    alert("Digite uma tarefa!");
    return;
  }

  const novaTarefa = {
    id: Date.now(),
    texto: texto,
    concluida: false
  };

  tarefas.push(novaTarefa);
  salvarTarefas();
  criarTarefaNaTela(novaTarefa);
  atualizarContador();
  verificarListaVazia();

  input.value = "";
  input.focus();
}

function carregarTarefas() {
  lista.innerHTML = "";

  tarefas.forEach(function (tarefa) {
    criarTarefaNaTela(tarefa);
  });

  atualizarContador();
  verificarListaVazia();
}

botao.onclick = adicionarTarefa;

input.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    adicionarTarefa();
  }
});

botaoLimpar.onclick = function () {
  tarefas = [];
  lista.innerHTML = "";
  salvarTarefas();
  atualizarContador();
  verificarListaVazia();
};

carregarTarefas();