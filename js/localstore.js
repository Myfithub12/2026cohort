const LocalStore = (() => {

    function save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function load(key) {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    }

    function remove(key) {
        localStorage.removeItem(key);
    }

    function getAll() {
        const items = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            items.push({
                key,
                size: value.length,
                data: JSON.parse(value)
            });
        }
        return items;
    }

    function clearAll() {
        localStorage.clear();
    }

    return { save, load, remove, getAll, clearAll };

})();