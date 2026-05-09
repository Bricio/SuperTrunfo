# 🃏 Criador de Super Trunfo Dinâmico

Este projeto é uma ferramenta web para criação, personalização e impressão de cartas de baralho estilo "Super Trunfo". Ele transforma um arquivo JSON em um deck visual completo, permitindo controle total sobre quais dados exibir e como imprimi-los.

---

## 🚀 Funcionalidades

*   **Importação Automática:** Lê dados de um arquivo `data.json` local.
*   **Gestão de Atributos:**
    *   Escolha quais campos do JSON aparecem na carta via checkboxes.
    *   **Labels Customizados:** Renomeie rótulos em tempo real (ex: de `hp` para `Pontos de Vida`). O sistema respeita exatamente o que você digitar.
    *   **Ordenação:** Botões de seta (↑ e ↓) para definir a ordem dos dados na carta.
*   **Design Automático:**
    *   Cores das bordas definidas dinamicamente pelo campo `type` no JSON.
    *   **Formatação de Título:** O nome principal da carta é formatado automaticamente, enquanto os valores dos atributos permanecem fiéis ao JSON.
    *   **Imagens Inteligentes:** Vincula fotos automaticamente pela pasta `./images/` usando o `id` do item.
*   **Módulo de Impressão A4:**
    *   Seleção individual de cartas para o deck de impressão com suporte a "Selecionar Todos".
    *   **Grid Configurável:** Defina quantas linhas e colunas deseja por página.
    *   **Escalonamento Fluido:** As cartas são redimensionadas proporcionalmente para caber no grid escolhido sem cortar textos ou imagens.

---

## 📂 Estrutura do Projeto

*   `index.html`: Interface principal e controles de configuração.
*   `style.css`: Estilização das cartas e regras de layout.
*   `script.js`: Lógica de carregamento, ordenação e motor de impressão.
*   `data.json`: Arquivo contendo os dados das cartas.
*   `/images`: Pasta para as imagens no formato `{id}.png`.

---

## 🛠️ Configuração do JSON

O arquivo `data.json` deve estar na raiz e seguir este formato:

```json
[
  {
    "id": "0001",
    "name": "avião comercial",
    "type": {
      "main": { "name": "Aéreo", "color": "#9bcc50" }
    },
    "velocidade": "900 km/h",
    "capacidade": "180 passageiros"
  }
]
```
---
## 📝 Como usar

1.  **Imagens:** Certifique-se de que suas fotos estão na pasta `./images/` e renomeadas exatamente com o ID presente no JSON (ex: `0001.png`, `0002.png`).
2.  **Servidor Local:** Devido às restrições de segurança do navegador (CORS) para leitura de arquivos locais, é necessário rodar o projeto em um servidor local. 
    *   *Sugestão:* Use a extensão **Live Server** no VS Code ou o comando `python -m http.server` no terminal.
3.  **Ajustes de Atributos:** 
    *   Use as setas (↑ e ↓) para definir qual dado deve aparecer primeiro na carta.
    *   Digite no campo de texto para renomear o atributo (o que você digitar será exibido literalmente).
4.  **Geração e Impressão:** 
    *   Clique em "Gerar Cartas" para visualizar o baralho.
    *   Marque as cartas que deseja imprimir (ou use o "Selecionar Todas").
    *   Configure a grade (Linhas x Colunas) e clique em "Imprimir Selecionadas".

---

## ⚖️ Licença

Este projeto é de código aberto e está licenciado sob a **Licença MIT**. Você é livre para modificar, distribuir e utilizar para fins comerciais ou privados.

---
*Gerado com suporte de Gemini 3 Flash.*
