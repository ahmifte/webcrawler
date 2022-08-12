const isNumeric = (val) => {
  return !isNaN(Number(val));
};

// Fetch the disallowed words from the url provided in the take home assignment instructions
async function fetchDisallowedWords() {
  const response = fetch(
    "https://gist.githubusercontent.com/Thessiah/fb969b429b4d6173916628c7d92bf6e4/raw/fb30bf33cbade43fd667c45437d4937b53ce868a/top1k.json"
  ).then((value) => value.json());

  return new Set(await response);
}

async function extractWordFrequency(text) {
  // Extract words using regexp
  let words = text.match(/\w+/g);
  console.log(words);
  let frequency = new Map();
  const disallowedWords = await fetchDisallowedWords();
  for (let word of words) {
    const lowerCaseWord = word.toLowerCase();
    if (!disallowedWords.has(lowerCaseWord) && !isNumeric(lowerCaseWord)) {
      frequency[lowerCaseWord]
        ? frequency[lowerCaseWord]++
        : (frequency[lowerCaseWord] = 1);
    }
  }

  console.log(frequency);
  return frequency;
}

function findMostFrequentWords(text) {
  console.log(
    sortByWordFrequency(Array(extractWordFrequency(text))).slice(0, 24)
  );
  return sortByWordFrequency(Array(extractWordFrequency(text))).slice(0, 24);
}

function sortByWordFrequency(frequencyArray) {
  return frequencyArray.sort((a, b) => b[1] - a[1]);
}

findMostFrequentWords(document.body.innerText);
