import ar from "./ar.json";
import en from "./en.json";

export function getDictionary(lang) {
  return lang === "en" ? en : ar;
}

export function getDir(lang) {
  return lang === "en" ? "ltr" : "rtl";
}
