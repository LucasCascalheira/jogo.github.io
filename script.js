const palavrasPorNivel = {
  facil: ["HTML", "CSS", "FOR", "VAR", "IF", "DIV", "BODY", "SPAN", "CLASS", "ID"],
  medio: ["PYTHON", "JAVA", "ARRAY", "OBJECT", "WHILE", "STRING", "BOOLEAN", "FLOAT", "METHOD", "SWITCH"],
  dificil: ["RECURSION", "ASYNC", "FUNCTION", "COMPILER", "ALGORITHM", "FRAMEWORK", "ENCAPSULATION", "POLYMORPHISM", "INHERITANCE", "INTERFACE"]
};
const definicoes = {
        HTML: "A language used to create web pages.",
        CSS: "A style language that changes how websites look.",
        FOR: "A loop that repeats actions a certain number of times.",
        VAR: "A way to store a value in programming.",
        IF: "A condition that runs code only if something is true.",
        DIV: "A container used to group content in web pages.",
        BODY: "The main content area of a web page.",
        SPAN: "A small container used to style or group text.",
        CLASS: "A name that groups HTML elements for styling or scripts.",
        ID: "A unique name for an HTML element.",
        
        PYTHON: "A popular programming language known for being easy to read.",
        JAVA: "A widely-used programming language, especially for apps and servers.",
        ARRAY: "A list that stores multiple values in one place.",
        OBJECT: "A group of related data and functions.",
        WHILE: "A loop that repeats while a condition is true.",
        STRING: "Text used in programming.",
        BOOLEAN: "A type with only two values: true or false.",
        FLOAT: "A number with a decimal point.",
        METHOD: "A function that belongs to an object.",
        SWITCH: "A way to choose between different cases in code.",
        
        RECURSION: "When a function calls itself to solve a problem.",
        ASYNC: "Code that runs without waiting, useful for slow tasks.",
        FUNCTION: "A set of instructions that can be used many times.",
        COMPILER: "A tool that turns code into something the computer can run.",
        ALGORITHM: "A step-by-step way to solve a problem.",
        FRAMEWORK: "A set of tools to build software faster and easier.",
        ENCAPSULATION: "Hiding details inside an object to keep code clean.",
        POLYMORPHISM: "One function acting differently depending on the input.",
        INHERITANCE: "When one class shares features with another.",
        INTERFACE: "A way to define what methods a class must use."
      };
    const tamanhoGrade = 14;
    let grid = [], palavras = [], selecionadas = [], encontrados = [], score = 0, timer = 0, interval;

    function criarGridVazio() {
      grid = Array.from({ length: tamanhoGrade }, () =>
        Array.from({ length: tamanhoGrade }, () => "")
      );
    }

    function cabePalavra(palavra, x, y, dir) {
      if (dir === "H") {
        if (x + palavra.length > tamanhoGrade) return false;
        for (let i = 0; i < palavra.length; i++) {
          if (grid[y][x + i] && grid[y][x + i] !== palavra[i]) return false;
        }
      } else {
        if (y + palavra.length > tamanhoGrade) return false;
        for (let i = 0; i < palavra.length; i++) {
          if (grid[y + i][x] && grid[y + i][x] !== palavra[i]) return false;
        }
      }
      return true;
    }

    function preencherPalavras() {
      for (let palavra of palavras) {
        let colocada = false;
        while (!colocada) {
          let dir = Math.random() < 0.5 ? "H" : "V";
          let x = Math.floor(Math.random() * tamanhoGrade);
          let y = Math.floor(Math.random() * tamanhoGrade);
          if (cabePalavra(palavra, x, y, dir)) {
            for (let i = 0; i < palavra.length; i++) {
              if (dir === "H") grid[y][x + i] = palavra[i];
              else grid[y + i][x] = palavra[i];
            }
            colocada = true;
          }
        }
      }
    }

    function preencherRestante() {
      const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (let y = 0; y < tamanhoGrade; y++) {
        for (let x = 0; x < tamanhoGrade; x++) {
          if (grid[y][x] === "") {
            grid[y][x] = letras[Math.floor(Math.random() * letras.length)];
          }
        }
      }
    }

    function mostrarGrid() {
      const gridDiv = document.getElementById("grid");
      gridDiv.innerHTML = "";
      for (let y = 0; y < tamanhoGrade; y++) {
        for (let x = 0; x < tamanhoGrade; x++) {
          const cell = document.createElement("div");
          cell.className = "cell";
          cell.textContent = grid[y][x];
          cell.dataset.x = x;
          cell.dataset.y = y;
          cell.addEventListener("mousedown", selecionarInicio);
          cell.addEventListener("mouseenter", selecionarArrasto);
          cell.addEventListener("mouseup", selecionarFim);

// NOVOS EVENTOS PARA TOUCH
            cell.addEventListener("touchstart", selecionarInicioTouch, { passive: false });
            cell.addEventListener("touchmove", selecionarArrastoTouch, { passive: false });
            cell.addEventListener("touchend", selecionarFimTouch);
          gridDiv.appendChild(cell);
        }
      }
    }

    function mostrarListaPalavras() {
  const listDiv = document.getElementById("word-list");
  const nivel = document.getElementById("level-select").value;

  if (nivel === "dificil") {
    listDiv.innerHTML = "<h3>Encontre as palavras pelas definições:</h3><ul>" +
      palavras.map(p => `<li id="palavra-${p}">${definicoes[p]}</li>`).join("") +
      "</ul>";
  } else if (nivel === "medio") {
    // Embaralha e divide as palavras em duas metades
    const embaralhadas = [...palavras].sort(() => Math.random() - 0.5);
    const metade = Math.ceil(embaralhadas.length / 2);

    const primeiraParte = embaralhadas.slice(0, metade); // Exibe como texto
    const segundaParte = embaralhadas.slice(metade);     // Exibe como definição

    listDiv.innerHTML = "<h3>Encontre as palavras (mistura de nomes e definições):</h3><ul>" +
      primeiraParte.map(p => `<li id="palavra-${p}">${p}</li>`).join("") +
      segundaParte.map(p => `<li id="palavra-${p}">${definicoes[p]}</li>`).join("") +
      "</ul>";
  } else {
    listDiv.innerHTML = "<h3>Encontre as palavras:</h3><ul>" +
      palavras.map(p => `<li id="palavra-${p}">${p}</li>`).join("") +
      "</ul>";
  }
}

    function startGame() {
      const nome = document.getElementById("player-name").value.trim();
      if (!nome) {
        alert("Por favor, digite seu nome para começar.");
        return;
      }

      clearInterval(interval);
      score = 0;
      timer = 0;
      document.getElementById("score").textContent = score;
      document.getElementById("timer").textContent = timer;

      const nivel = document.getElementById("level-select").value;
      palavras = palavrasPorNivel[nivel];
      encontrados = [];
      criarGridVazio();
      preencherPalavras();
      preencherRestante();
      mostrarGrid();
      mostrarListaPalavras();
      interval = setInterval(() => {
        timer++;
        document.getElementById("timer").textContent = timer;
      }, 1000);
    }

    function selecionarInicio(e) {
      selecionadas = [e.target];
      e.target.classList.add("selected");
    }

    function selecionarArrasto(e) {
      if (selecionadas.length > 0 && !selecionadas.includes(e.target)) {
        selecionadas.push(e.target);
        e.target.classList.add("selected");
      }
    }

    function selecionarFim() {
  const palavra = selecionadas.map(c => c.textContent).join("");
  const palavraInv = [...palavra].reverse().join("");

  const encontrada = palavras.find(p =>
    !encontrados.includes(p) && (p === palavra || p === palavraInv)
  );

  if (encontrada) {
    for (let cel of selecionadas) {
      cel.classList.remove("selected");
      cel.classList.add("correct");
    }

    const li = document.getElementById(`palavra-${encontrada}`);
    li.classList.add("found");
    li.innerHTML = `<strong>${encontrada}</strong>: ${definicoes[encontrada]}`;

    encontrados.push(encontrada);
    score += 10;
    document.getElementById("score").textContent = score;

    if (encontrados.length === palavras.length) {
      clearInterval(interval);
      const nome = document.getElementById("player-name").value.trim();
      alert(`Parabéns, ${nome}! Você terminou em ${timer}s com ${score} pontos!`);
      salvarRanking(nome, score, timer);
      mostrarRanking();
    }
  } else {
    for (let cel of selecionadas) cel.classList.remove("selected");
  }
  selecionadas = [];
}
function getCellFromTouch(touch) {
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  if (target && target.classList.contains("cell")) return target;
  return null;
}

function selecionarInicioTouch(e) {
  e.preventDefault(); // Impede o scroll
  const cell = getCellFromTouch(e.touches[0]);
  if (cell) {
    selecionadas = [cell];
    cell.classList.add("selected");
  }
}

function selecionarArrastoTouch(e) {
  e.preventDefault();
  const cell = getCellFromTouch(e.touches[0]);
  if (cell && !selecionadas.includes(cell)) {
    selecionadas.push(cell);
    cell.classList.add("selected");
  }
}

function selecionarFimTouch(e) {
  e.preventDefault();
  selecionarFim();
}

    function salvarRanking(nome, pontos, tempo) {
      const nivel = document.getElementById("level-select").value;
      let ranking = JSON.parse(localStorage.getItem("ranking")) || {};
      if (!ranking[nivel]) ranking[nivel] = [];
      ranking[nivel].push({ nome, pontos, tempo, data: new Date().toLocaleString() });
      ranking[nivel].sort((a, b) => b.pontos - a.pontos || a.tempo - b.tempo);
      ranking[nivel] = ranking[nivel].slice(0, 5);
      localStorage.setItem("ranking", JSON.stringify(ranking));
    }

    function mostrarRanking() {
      const nivel = document.getElementById("level-select").value;
      const div = document.getElementById("ranking");
      const ranking = JSON.parse(localStorage.getItem("ranking")) || {};
      const lista = ranking[nivel] || [];

      div.innerHTML = "<h3>🏆 Ranking - " + nivel.charAt(0).toUpperCase() + nivel.slice(1) + "</h3>";
      if (lista.length === 0) {
        div.innerHTML += "<p>Sem pontuações ainda.</p>";
        return;
      }
      div.innerHTML += "<ol>" + lista.map(e =>
        `<li>${e.nome} - ${e.pontos} pts - ${e.tempo}s</li>`
        ).join("") + "</ol>";
    }

    document.addEventListener("mouseup", () => {
      if (selecionadas.length > 0) selecionarFim();
    });

    startGame();
    mostrarRanking();
