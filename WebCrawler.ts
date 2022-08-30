// Takehome assignment
// By Ahmed Iftekhar

const isNumeric = (val) => {
  // Checks if string is a number, if so return false
  return !isNaN(Number(val));
};

function sortByArrayFrequency(arr) {
  // Sorts array of [string, number] values by frequency (index = 1)
  return arr.sort((a, b) => b[1] - a[1]);
}

const isValidCharacter = (ch) => {
  // Checks if valid one character Word
  return ch === "a" || ch === "i";
};

async function fetchDisallowedWords() {
  // Fetch the disallowed words from the url provided in the take home assignment instructions
  const response = fetch(
    "https://gist.githubusercontent.com/Thessiah/fb969b429b4d6173916628c7d92bf6e4/raw/fb30bf33cbade43fd667c45437d4937b53ce868a/top1k.json"
  ).then((value) => value.json());
  return new Set(await response);
}

async function extractWordFrequency(text) {
  // Extract words using regexp
  const words = text.match(/\w+/g);
  // Map of words to frequency
  let frequency = new Map();
  // Fetch disallowed words then parse text argument
  await fetchDisallowedWords().then((disallowedWords) => {
    for (let word of words) {
      const lowerCaseWord = word.toLowerCase();
      // Validity check for single characters
      if (
        lowerCaseWord.length === 1 &&
        !isValidCharacter(lowerCaseWord.toLowerCase())
      )
        continue;
      // Check if word is invalid and that word is not numeric
      if (!disallowedWords.has(lowerCaseWord) && !isNumeric(lowerCaseWord)) {
        !!frequency.get(lowerCaseWord)
          ? frequency.set(lowerCaseWord, frequency.get(lowerCaseWord) + 1)
          : frequency.set(lowerCaseWord, 1);
      }
    }
  });
  return frequency;
}

async function findMostCommonWords(text, n) {
  // Pull word frequency Map<string, number> from current webpage text
  const frequencyMap = await extractWordFrequency(text);
  // Convert to 2D array of [string, number] pairs
  const array = [...frequencyMap.entries()];
  let mostCommonWords = sortByArrayFrequency(array).slice(0, n);
  // Print out array of top 25 words
  mostCommonWords = mostCommonWords.flatMap((val) => val[0]);
  // Prints most common words to console for Part 1
  console.log(mostCommonWords);
  return { mostCommonWords, frequencyMap };
}

async function replaceCommonText(text) {
  // Get the most common words and frequency maps
  const { mostCommonWords, frequencyMap } = await findMostCommonWords(text, 25);
  let textCopy = text;
  // Loops through array of most common words and replaces them in text
  for (let word of mostCommonWords) {
    let regexp = new RegExp(word, "gi");
    let temp = word.repeat(frequencyMap.get(word));
    textCopy = textCopy.replaceAll(regexp, temp);
  }
  // Logs the new text with replacements to console
  console.log(textCopy);
  return textCopy;
}

// Pull text from document
const webpageText = document.body.innerText || document.body.textContent;

// Find top 25 most common words on current webpage if given page has text content
// Both Part 1 and Part 2 are logged by calls in this function
if (!!webpageText) {
  replaceCommonText(webpageText);
}
