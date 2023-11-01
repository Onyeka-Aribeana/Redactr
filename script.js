const redactBtn = document.getElementById("submit-btn");
const contentField = document.getElementById("content");
const redactionWordField = document.getElementById("redaction-words");
const redactionStyleField = document.getElementById("redaction-style");
const wordCountElem = document.getElementById("redacted-word-count");
const durationElem = document.getElementById("redacted-duration");
const resultDisplay = document.querySelector(".result__text");
const copyBtn = document.getElementById("copy-btn");

let redactedWordCount,
  redactionStyle,
  isRedacted = false;

const init = function () {
  redactedWordCount = 0;
  redactionStyle = "*****"; // default
};

const redactText = function (content, wordsToRedact, redactionStyle) {
  const redactionWordsArr = wordsToRedact
    .split(" ")
    .map((word) => word.toLowerCase().trim());

  const regex = new RegExp(`\\b(${redactionWordsArr.join("|")})\\b`, "gi");
  const result = content.replace(regex, function (x) {
    redactedWordCount += 1;
    return `<span class='highlight'>${redactionStyle}</span>`;
  });
  return result;
};

const copyToClipboard = async function (e) {
  e.preventDefault();

  if (isRedacted) {
    await navigator.clipboard.writeText(resultDisplay.textContent);
    copyBtn.dataset.type = "Copied!";
    setTimeout(() => (copyBtn.dataset.type = "Copy"), 1000);
  }
};

init();

// EVENT LISTENERS
redactBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const content = contentField.value.replace(/\n/g, "<br>\n");
  const redactionWords = redactionWordField.value.trim();
  const redactionOption = redactionStyleField.value;

  if (!content || !redactionWords) {
    // Error Handling
    return;
  }

  const start = performance.now();

  if (redactionOption)
    redactionStyle =
      redactionOption.length === 1
        ? redactionOption.repeat(5)
        : redactionOption;

  resultDisplay.innerHTML = redactText(content, redactionWords, redactionStyle);

  const end = performance.now();

  wordCountElem.textContent = redactedWordCount;
  durationElem.textContent = (end - start).toFixed(2) + " ms";
  isRedacted = true;
  init();
});

copyBtn.addEventListener("click", copyToClipboard);
