let gameData = [];
let attributeOrder = [];

async function loadData() {
  try {
    const response = await fetch("data.json");
    gameData = await response.json();

    const ignore = ["id", "name", "type"];
    const keys = Object.keys(gameData[0]).filter(
      (key) => !ignore.includes(key),
    );

    // Inicializa com o label vazio para usar a chave do JSON como fallback inicial
    attributeOrder = keys.map((key) => ({ key: key, label: "" }));

    renderSelectors();
  } catch (error) {
    console.error("Erro:", error);
  }
}

// Formata apenas o nome principal do objeto vindo do JSON
function toTitleCase(str) {
  if (!str) return "";
  return (
    str.toString().charAt(0).toUpperCase() +
    str.toString().slice(1).toLowerCase()
  );
}

function renderSelectors() {
  const selectorDiv = document.getElementById("attribute-selector");
  selectorDiv.innerHTML = "";

  attributeOrder.forEach((attr, index) => {
    const div = document.createElement("div");
    div.className = "attr-input-group";
    div.innerHTML = `
            <button type="button" onclick="changeOrder(${index}, -1)">↑</button>
            <button type="button" onclick="changeOrder(${index}, 1)">↓</button>
            <input type="checkbox" id="check-${attr.key}" value="${attr.key}" checked>
            <label for="check-${attr.key}">Campo: <strong>${attr.key}</strong></label>
            <input type="text" id="label-${attr.key}" value="${attr.label}" 
                   placeholder="Nome na carta" oninput="updateAttributeLabel(${index}, this.value)">
        `;
    selectorDiv.appendChild(div);
  });
}

// Atualiza o valor no array para não perder ao reordenar
function updateAttributeLabel(index, value) {
  attributeOrder[index].label = value;
}

function changeOrder(index, step) {
  const newIndex = index + step;
  if (newIndex >= 0 && newIndex < attributeOrder.length) {
    const temp = attributeOrder[index];
    attributeOrder[index] = attributeOrder[newIndex];
    attributeOrder[newIndex] = temp;
    renderSelectors();
  }
}

function generateCards() {
  const deckContainer = document.getElementById("deck-container");
  deckContainer.innerHTML = "";

  gameData.forEach((item) => {
    const cardWrapper = document.createElement("div");
    cardWrapper.className = "card-wrapper";

    const card = document.createElement("div");
    card.className = "card";
    card.id = `card-render-${item.id}`; // ID para clonar depois
    card.style.borderColor = item.type.main.color;

    const header = `
            <div class="card-header">
                <span>${toTitleCase(item.name)}</span>
                <span>#${item.id}</span>
            </div>
        `;

    const img = `<img src="./images/${item.id}.png" class="card-image" alt="${item.name}" 
                     onerror="this.src='https://via.placeholder.com/250x180?text=Sem+Imagem'">`;

    let statsHtml = '<div class="card-body">';
    attributeOrder.forEach((attr) => {
      const isChecked = document.getElementById(`check-${attr.key}`).checked;
      if (isChecked) {
        const displayLabel = attr.label !== "" ? attr.label : attr.key;
        statsHtml += `
                    <div class="stat-row">
                        <span class="stat-label">${displayLabel}</span>
                        <span class="stat-value">${item[attr.key]}</span> 
                    </div>
                `;
      }
    });
    statsHtml += "</div>";

    card.innerHTML = header + img + statsHtml;

    // Checkbox de seleção para impressão
    const selectContainer = document.createElement("div");
    selectContainer.className = "card-select-overlay";
    selectContainer.innerHTML = `<input type="checkbox" class="print-selector" data-id="${item.id}" onchange="updateSelectAllStatus()">`;

    cardWrapper.appendChild(selectContainer);
    cardWrapper.appendChild(card);
    deckContainer.appendChild(cardWrapper);
  });
}

// Lógica do Checkbox "Selecionar Todos"
document.getElementById("select-all").addEventListener("change", function (e) {
  const checkboxes = document.querySelectorAll(".print-selector");
  checkboxes.forEach((cb) => (cb.checked = e.target.checked));
});

function updateSelectAllStatus() {
  const checkboxes = document.querySelectorAll(".print-selector");
  const allChecked = Array.from(checkboxes).every((cb) => cb.checked);
  const anyChecked = Array.from(checkboxes).some((cb) => cb.checked);

  const selectAllBtn = document.getElementById("select-all");
  selectAllBtn.checked = allChecked;
  selectAllBtn.indeterminate = anyChecked && !allChecked;
}

// Lógica de Impressão
document.getElementById("btn-print").addEventListener("click", () => {
  const selectedCheckboxes = document.querySelectorAll(
    ".print-selector:checked",
  );
  const cols = parseInt(document.getElementById("print-cols").value) || 3;
  const rows = parseInt(document.getElementById("print-rows").value) || 4;

  if (selectedCheckboxes.length === 0)
    return alert("Selecione ao menos uma carta!");

  const printWindow = window.open("", "_blank");
  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join("");
      } catch (e) {
        return "";
      }
    })
    .join("");

  printWindow.document.write(`
        <html>
        <head>
            <title>Impressão Super Trunfo</title>
            <style>
                ${styles}
                
                @page { 
                    size: A4; 
                    margin: 5mm; /* Margem pequena para aproveitar o papel */
                }
                
                body { 
                    background: white !important; 
                    margin: 0; 
                    padding: 0;
                    -webkit-print-color-adjust: exact; /* Garante que cores de fundo saiam */
                }

                .print-page {
                    display: grid;
                    grid-template-columns: repeat(${cols}, 1fr);
                    grid-template-rows: repeat(${rows}, 1fr);
                    width: 200mm; /* A4 útil com margem de 5mm */
                    height: 287mm; 
                    page-break-after: always;
                    box-sizing: border-box;
                    gap: 2mm;
                    padding: 2mm;
                }

                .print-page:last-child {
                    page-break-after: auto;
                }

                /* RESET DE TAMANHO PARA IMPRESSÃO */
                .card {
                    width: 100% !important; /* Ocupa a largura da coluna do grid */
                    height: 100% !important; /* Ocupa a altura da linha do grid */
                    max-width: none !important;
                    margin: 0 !important;
                    display: flex;
                    flex-direction: column;
                    padding: 2% !important; /* Padding proporcional */
                    font-size: calc(100vw / (${cols} * 15)) !important; /* Fonte dinâmica */
                    border-width: 3px !important;
                }

                .card-image {
                    width: 100% !important;
                    height: 45% !important; /* Mantém a imagem proporcional à altura da carta */
                    object-fit: cover !important;
                    margin: 2% 0 !important;
                }

                .card-header {
                    font-size: 1.2em !important;
                    margin-bottom: 2% !important;
                }

                .card-body {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-evenly; /* Distribui os dados no espaço que sobrar */
                }

                .stat-row {
                    padding: 1% 0 !important;
                    font-size: 1em !important;
                }

                .card-select-overlay, .no-print {
                    display: none !important;
                }
            </style>
        </head>
        <body>
    `);

  let htmlContent = '<div class="print-page">';
  const cardsPerPage = cols * rows;

  selectedCheckboxes.forEach((cb, index) => {
    if (index > 0 && index % cardsPerPage === 0) {
      htmlContent += '</div><div class="print-page">';
    }
    const originalCard = cb.parentElement.nextElementSibling;
    htmlContent += originalCard.outerHTML;
  });

  htmlContent += "</div>";
  printWindow.document.write(htmlContent);
  printWindow.document.write(`
            <script>
                window.onload = () => {
                    setTimeout(() => { 
                        window.print(); 
                        window.close(); 
                    }, 500);
                };
            <\/script>
        </body>
        </html>
    `);
  printWindow.document.close();
});

document
  .getElementById("btn-generate")
  .addEventListener("click", generateCards);
loadData();
