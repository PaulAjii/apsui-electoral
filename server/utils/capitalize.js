/**
 * @description Capitalizes a word returning the word having its first letter in uppercase.
 * @param word:string - the word to be capitalized
 * @returns :string - the word with its first letter in uppercase or "" if the word is not valid or is empty
 * @example
 * // capitalize a word
 * console.log("word") // "Word"
 */

const capitalize = (word) => {
	if (!word) return '';
	const firstLetter = word.split('').map((_) => word[0].toUpperCase());
	const otherLetters = word.substring(1);

	return `${firstLetter[0]}${otherLetters}`;
};

export default capitalize;
