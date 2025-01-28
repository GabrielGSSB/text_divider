// Seleciona os elementos no DOM
const splitButton = document.getElementById('split-button');
const textInput = document.getElementById('text-input');
const delimiterInput = document.getElementById('delimiter');
const resultContainer = document.getElementById('result-container');

/**
 * Função que localiza o melhor ponto de corte
 * para evitar "quebrar" palavras ou frases no meio.
 * 
 * A estratégia é:
 *   1. Tentamos cortar no chunkSize ou antes disso.
 *   2. Procuramos, voltando para trás, o primeiro ponto
 *      que seja um final de frase ('.', '!', '?').
 *   3. Se não achar, procuramos um espaço.
 *   4. Se não achar, cortamos mesmo assim no chunkSize.
 * 
 * @param {string} text Texto total
 * @param {number} start Posição inicial do corte
 * @param {number} chunkSize Tamanho máximo desejado
 * @returns {number} Índice final apropriado para o corte
 */
function findCutIndex(text, start, chunkSize) {
  const punctuations = ['.', '!', '?'];
  let end = start + chunkSize;
  
  // Se já passa do final do texto
  if (end >= text.length) {
    return text.length;
  }

  // Vamos percorrer de end para trás, até chegar em start
  let bestIndex = -1;
  
  // Tenta primeiro encontrar pontuação final
  for (let i = end; i >= start; i--) {
    if (punctuations.includes(text[i])) {
      bestIndex = i + 1; 
      break;
    }
  }
  
  // Se não encontrou pontuação final...
  if (bestIndex === -1) {
    // ...tentamos encontrar espaço
    for (let i = end; i >= start; i--) {
      if (text[i] === ' ') {
        bestIndex = i;
        break;
      }
    }
  }
  
  // Se ainda não encontrou nada, corta em chunkSize
  if (bestIndex === -1 || bestIndex === start) {
    bestIndex = end;
  }

  return bestIndex;
}

/**
 * Função que divide o texto sem quebrar palavras
 * (ou frases) no meio, se possível.
 * 
 * @param {string} text 
 * @param {number} chunkSize 
 * @returns {string[]} array de blocos de texto
 */
function splitTextSmart(text, chunkSize) {
  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    // Calcula onde terminar este bloco
    const cutIndex = findCutIndex(text, startIndex, chunkSize);
    const chunk = text.slice(startIndex, cutIndex).trimEnd();

    chunks.push(chunk);
    startIndex = cutIndex; // próximo bloco começa no final deste
  }

  return chunks;
}

// Função principal, acionada ao clicar em "Dividir"
function handleSplit() {
  const text = textInput.value;
  const delimiter = delimiterInput.value.trim();
  
  // Limpa resultados anteriores
  resultContainer.innerHTML = '';

  // Verifica se o delimitador é um número válido
  const chunkSize = parseInt(delimiter, 10);
  if (isNaN(chunkSize) || chunkSize <= 0) {
    resultContainer.textContent = 
      'Por favor, insira um número válido maior que zero.';
    return;
  }
  
  if (!text) {
    resultContainer.textContent = 'Nenhum texto para dividir.';
    return;
  }

  // Divide o texto de forma "inteligente", sem quebrar palavras/frases
  const parts = splitTextSmart(text, chunkSize);

  // Monta a exibição de cada bloco
  parts.forEach((part) => {
    // Se por algum motivo vier string vazia, podemos ignorar ou exibir
    if (!part) return;
    
    // Cria container principal do bloco
    const chunkContainer = document.createElement('div');
    chunkContainer.classList.add('chunk-container');

    // Div que mostra o texto propriamente
    const chunkTextDiv = document.createElement('div');
    chunkTextDiv.classList.add('chunk-text');
    chunkTextDiv.textContent = part;

    // Parte superior: texto e botão de copiar
    const upperContentDiv = document.createElement('div');
    upperContentDiv.classList.add('upper-content');

    // Botão de copiar
    const copyButton = document.createElement('button');
    copyButton.classList.add('copy-button');
    copyButton.textContent = 'Copiar';

    // Ao clicar, copia o texto do chunk
    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(part)
        .then(() => {
          copyButton.classList.add('copied');
          copyButton.textContent = 'Copiado';
        })
        .catch((err) => {
          console.error('Erro ao copiar: ', err);
        });
    });

    // Adiciona o texto e o botão de copiar no bloco superior
    upperContentDiv.appendChild(copyButton);

    // Botão para "Ver mais" / "Ver menos"
    const expandButton = document.createElement('button');
    expandButton.classList.add('expand-button');

    // Precisamos checar se, no estado "colapsado", existe overflow 
    // (ou seja, se o texto ocupa mais que 4 linhas) para decidir 
    // se mostramos o botão ou não. Podemos checar no onLoad do layout:
    // Para simplificar, vamos inserir o botão sempre, mas 
    // só funciona se o texto realmente tiver overflow.

    expandButton.textContent = 'Ver mais';
    
    // Evento de clique que expande/colapsa o texto
    expandButton.addEventListener('click', () => {
      if (chunkTextDiv.classList.contains('expanded')) {
        // Se já está expandido, vamos reduzir
        chunkTextDiv.classList.remove('expanded');
        expandButton.textContent = 'Ver mais';
      } else {
        // Senão, expandir
        chunkTextDiv.classList.add('expanded');
        expandButton.textContent = 'Ver menos';
      }
    });

    // Monta toda a estrutura
    chunkContainer.appendChild(upperContentDiv);
    chunkContainer.appendChild(chunkTextDiv);
    chunkContainer.appendChild(expandButton);

    // Adiciona esse bloco ao container de resultados
    resultContainer.appendChild(chunkContainer);
  });
}

// Listener do botão principal
splitButton.addEventListener('click', handleSplit);