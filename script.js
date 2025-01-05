document.getElementById("divide-button").addEventListener("click", function () {
  const textInput = document.getElementById("text-input").value;
  const charLimit = parseInt(document.getElementById("char-limit").value);
  const resultContainer = document.getElementById("result-container");

  // Limpar resultados anteriores
  resultContainer.innerHTML = "";

  // Verificar entradas
  if (!textInput) {
    resultContainer.textContent = "Por favor, insira um texto.";
    return;
  }

  if (!charLimit || charLimit <= 0) {
    resultContainer.textContent = "Por favor, insira um número válido de caracteres.";
    return;
  }

  // Dividir o texto em partes respeitando frases
  const parts = [];
  let currentPosition = 0;

  while (currentPosition < textInput.length) {
    let endPosition = currentPosition + charLimit;

    if (endPosition >= textInput.length) {
      // Última parte
      parts.push(textInput.substring(currentPosition).trim());
      break;
    }

    // Procurar o ponto final mais próximo antes do limite
    const lastPeriod = textInput.lastIndexOf('.', endPosition);
    const lastQuestion = textInput.lastIndexOf('?', endPosition);
    const lastExclamation = textInput.lastIndexOf('!', endPosition);
    const lastEllipsis = textInput.lastIndexOf('...', endPosition);
  
    const splitPosition = Math.max(lastPeriod, lastQuestion, lastExclamation, lastEllipsis);

    if (splitPosition > currentPosition) {
      // Cortar no final da frase
      endPosition = splitPosition + 1;
    }

    parts.push(textInput.substring(currentPosition, endPosition).trim());
    currentPosition = endPosition;
  }

  // Exibir os resultados em blocos separados
  parts.forEach((part, index) => {
    const block = document.createElement("div");
    block.classList.add("result-block");

    const header = document.createElement("div");
    header.classList.add("result-header");
    header.textContent = `Bloco ${index + 1}`;

    const content = document.createElement("div");
    content.classList.add("result-content");
    content.textContent = part;

    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("result-buttons");

    // Botão "Ocultar"
    const hideButton = document.createElement("button");
    hideButton.classList.add("hide-btn");
    hideButton.textContent = "Ocultar";
    hideButton.addEventListener("click", () => {
      content.style.display = "none";
      buttonsDiv.style.display = "none";
    });

    // Botão "Copiar"
    const copyButton = document.createElement("button");
    copyButton.classList.add("copy-btn");
    copyButton.textContent = "Copiar";
    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(part).then(() => {
        alert("Texto copiado para a área de transferência!");
      }).catch(() => {
        alert("Erro ao copiar o texto.");
      });
    });

    // Adicionar botões ao container de botões
    buttonsDiv.appendChild(copyButton);
    buttonsDiv.appendChild(hideButton);

    // Configurar estilo inicial (conteúdo oculto)
    content.style.display = "none";
    buttonsDiv.style.display = "none";

    // Alternar visibilidade ao clicar no cabeçalho
    header.addEventListener("click", () => {
      const isVisible = content.style.display === "block";
      content.style.display = isVisible ? "none" : "block";
      buttonsDiv.style.display = isVisible ? "none" : "flex";
    });

    block.appendChild(header);
    block.appendChild(content);
    block.appendChild(buttonsDiv);
    resultContainer.appendChild(block);
  });
});
