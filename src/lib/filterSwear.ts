import zhSwearWords from "naughty-words/zh.json";
import enSwearWords from "naughty-words/en.json";

export function filterSwearWords(text: string) {
    return zhSwearWords
        .concat(enSwearWords)
        .sort((a, b) => b.length - a.length)
        .reduce((prev, curr) => {
            return prev.replaceAll(curr, "*");
        }, text);
}
