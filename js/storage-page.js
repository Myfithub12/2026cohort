document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("storageList");
    const clearAllBtn = document.getElementById("clearAll");

    function render() {
        const items = LocalStore.getAll();
        list.innerHTML = "";

        if (items.length === 0) {
            list.innerHTML = "<p>No stored data.</p>";
            return;
        }

        items.forEach(item => {
            const div = document.createElement("div");
            div.className = "item";

            div.innerHTML = `
                <span class="key">${item.key}</span><br>
                Size: ${item.size} bytes
                <button class="deleteBtn" data-key="${item.key}">Delete</button>
            `;

            list.appendChild(div);
        });

        document.querySelectorAll(".deleteBtn").forEach(btn => {
            btn.addEventListener("click", () => {
                LocalStore.remove(btn.dataset.key);
                render();
            });
        });
    }

    clearAllBtn.addEventListener("click", () => {
        LocalStore.clearAll();
        render();
    });

    render();
});