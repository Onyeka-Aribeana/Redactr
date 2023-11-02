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
  redactionStyle = "*"; // default
};

const redactText = function (content, wordsToRedact, redactionStyle) {
  // Regex for case-insensitive exact word match
  const regex = new RegExp(`\\b(${wordsToRedact.join("|")})\\b`, "gi");
  const result = content.replace(regex, function (x) {
    redactedWordCount += 1;
    return `<span class='highlight'>${
      redactionStyle.length === 1 && redactionStyle.match(/[^a-z0-9]/i)
        ? redactionStyle.repeat(x.length)
        : redactionStyle
    }</span>`;
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

const showError = function (isError = true) {
  const wrapper = this.closest(".form__input-wrapper");
  isError
    ? wrapper.classList.add("failed")
    : wrapper.classList.remove("failed");
};

init();

// EVENT LISTENERS
redactBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // retaining the line breaks in content
  const content = contentField.value.replace(/\n/g, "<br>\n");
  const redactionWords = redactionWordField.value.trim();
  const redactionOption = redactionStyleField.value.trim();

  if (!content || !redactionWords) {
    !content && showError.call(contentField);
    !redactionWords && showError.call(redactionWordField);
    return;
  }

  const redactionWordsArr = redactionWords
    .split(" ")
    .map((word) => word.toLowerCase().trim());

  if (redactionWordsArr.some((word) => !word.match(/^[A-Za-z0-9]+$/))) {
    showError.call(redactionWordField);
    return;
  }

  const start = performance.now();

  if (redactionOption) redactionStyle = redactionOption;

  resultDisplay.innerHTML = redactText(
    content,
    redactionWordsArr,
    redactionStyle
  );

  const end = performance.now();

  wordCountElem.textContent = redactedWordCount;
  durationElem.textContent = (end - start).toFixed(2) + " ms";
  isRedacted = true;
  init();
});

copyBtn.addEventListener("click", copyToClipboard);

[contentField, redactionWordField].forEach((field) =>
  field.addEventListener("blur", function () {
    if (field.value) showError.call(this, false);
  })
);
