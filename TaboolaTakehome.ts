// Fetch the disallowed words from the url provided in the take home assignment instructions
async function fetchDisallowedWords() {
  const response = await fetch(
    "https://gist.githubusercontent.com/Thessiah/fb969b429b4d6173916628c7d92bf6e4/raw/fb30bf33cbade43fd667c45437d4937b53ce868a/top1k.json"
  );
  const disallowedWords = await response.json();
  return new Set(disallowedWords);
}

async function extractWordFrequency(text: string) {
  // Extract words using regexp
  let words = text.match(/\w+/g) || [];
  console.log(words);
  let frequency = new Map<string, number>();
  const disallowedWords = await fetchDisallowedWords();
  for (let word of words) {
    const lowerCaseWord = word.toLowerCase();
    if (!disallowedWords.has(lowerCaseWord))
      frequency[lowerCaseWord]
        ? frequency[lowerCaseWord]++
        : (frequency[word] = 1);
  }

  console.log(frequency);
  return frequency;
}

async function findMostFrequentWords(text: string) {
  return sortByWordFrequency(
    Array.from(await extractWordFrequency(text))
  ).slice(0, 24);
}

function sortByWordFrequency(frequencyArray: Array<[string, number]>) {
  return frequencyArray.sort((a, b) => b[1] - a[1]);
}
