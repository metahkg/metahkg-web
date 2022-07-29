import zhSwearWords from "naughty-words/zh.json";
import enSwearWords from "naughty-words/en.json";

export function filterSwearWords(text: string) {
    return zhSwearWords.concat(enSwearWords).reduce((prev, curr) => {
        return prev.replaceAll(curr, "*");
    }, text);
}
