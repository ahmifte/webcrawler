const isNumeric = (val) => {
  // Checks if string is a number, if so return false
  return !isNaN(Number(val));
};


function sortByArrayFrequency(arr) {  
  // Sorts array of [string, number] values by frequency
  return arr.sort((a, b) => b[1] - a[1]);
}


async function fetchDisallowedWords() {
  // Fetch the disallowed words from the url provided in the take home assignment instructions
  const response = fetch(
    "https://gist.githubusercontent.com/Thessiah/fb969b429b4d6173916628c7d92bf6e4/raw/fb30bf33cbade43fd667c45437d4937b53ce868a/top1k.json"
  ).then((value) => value.json());

  return new Set(await response);
}

async function extractWordFrequency(text) {
  // Extract words using regexp
  let words = text.match(/\w+/g);
  // Map of words to frequency
  let frequency = new Map();
  // Fetch disallowed words then parse text argument
  await fetchDisallowedWords().then((disallowedWords) => {
    for (let word of words) {
      const lowerCaseWord = word.toLowerCase();
      if (!disallowedWords.has(lowerCaseWord) && !isNumeric(lowerCaseWord)) {
        !!frequency.get(lowerCaseWord)
          ? frequency.set(lowerCaseWord, frequency.get(lowerCaseWord) + 1)
          : frequency.set(lowerCaseWord, 1);
      }
    }
  });
  return frequency;
}

async function findMostCommonWords() {
  // Pull word frequency Map<string, number> from current webpage text
  const frequencyMap = await extractWordFrequency(
    document.body.innerText || document.body.textContent
  );
  // Convert to 2D array of [string, number] pairs
  const array = [...frequencyMap.entries()]
  console.log(array)
  console.log(sortByArrayFrequency(array).slice(0, 25))
  // Return top 25 words
  return sortByArrayFrequency(array).slice(0,25)
}


findMostCommonWords();
