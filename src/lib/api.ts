import Api from "metahkg-api";

export let api = Api({ token: localStorage.token });

export function resetApi() {
    api = Api({ token: localStorage.token });
}
