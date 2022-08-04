import zhSwearWords from "naughty-words/zh.json";
import enSwearWords from "naughty-words/en.json";

export function filterSwearWords(text: string) {
    return enSwearWords
        .sort((a, b) => b.length - a.length)
        .map((i) => new RegExp(` ${i}`, "gi"))
        .reduce(
            (prev, curr) => {
                return prev.replaceAll(curr, " *");
            },
            zhSwearWords
                .sort((a, b) => b.length - a.length)
                .reduce((prev, curr) => {
                    return prev.replaceAll(curr, "*");
                }, text)
        );
}
