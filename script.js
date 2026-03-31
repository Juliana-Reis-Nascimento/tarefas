const input = document.getElementById("inputTarefa")
const botao = document.getElementById("btnAdicionar")
const lista = document.getElementById("lista")
const contador = document.getElementById("contador")
const totalEl = document.getElementById("total")
const concluidasEl = document.getElementById("concluidas")
const pendentesEl = document.getElementById("pendentes")

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || []

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas))
}

function atualizarContador() {
  const total = tarefas.length

  const concluidas = tarefas.filter(function(tarefa) {
    return tarefa.concluida === true
  }).length

  const pendentes = total - concluidas

  totalEl.innerText = `Total: ${total}`
  concluidasEl.innerText = `✔ Concluídas: ${concluidas}`
  pendentesEl.innerText = `⏳ Pendentes: ${pendentes}`
}

function criarTarefaNaTela(tarefa) {
  const item = document.createElement("li")

  const span = document.createElement("span")
  span.innerText = tarefa.texto

  if (tarefa.concluida) {
    span.classList.add("concluida")
  }

  span.onclick = function() {
    span.classList.toggle("concluida")

    const tarefaEncontrada = tarefas.find(function(itemTarefa) {
      return itemTarefa.id === tarefa.id
    })

    if (tarefaEncontrada) {
      tarefaEncontrada.concluida = span.classList.contains("concluida")
      salvarTarefas()
      atualizarContador()
    }
  }

  const botaoRemover = document.createElement("button")
  botaoRemover.innerText = "Remover"

  botaoRemover.onclick = function() {
    item.remove()

    tarefas = tarefas.filter(function(itemTarefa) {
      return itemTarefa.id !== tarefa.id
    })

    salvarTarefas()
    atualizarContador()
  }

  item.appendChild(span)
  item.appendChild(botaoRemover)
  lista.appendChild(item)
}

function adicionarTarefa() {
  const texto = input.value.trim()

  if (texto === "") {
    alert("Digite uma tarefa!")
    return
  }

  const novaTarefa = {
    id: Date.now(),
    texto: texto,
    concluida: false
  }

  tarefas.push(novaTarefa)
  salvarTarefas()
  criarTarefaNaTela(novaTarefa)
  atualizarContador()

  input.value = ""
}

botao.onclick = adicionarTarefa

input.addEventListener("keydown", function(evento) {
  if (evento.key === "Enter") {
    adicionarTarefa()
  }
})

tarefas.forEach(function(tarefa) {
  criarTarefaNaTela(tarefa)
})

atualizarContador()