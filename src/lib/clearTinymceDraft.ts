export function clearTinymceDraft(path: string) {
    Object.keys(localStorage).forEach(function (key) {
        if (new RegExp(`^tinymce-autosave-${path}-draft\\d*$`).test(key)) {
            localStorage.removeItem(key);
        }
    });
}
