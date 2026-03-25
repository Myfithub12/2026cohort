function createInningCell() {
    return `
        <td>
            <select class="atbat-result">
                <option value="">-- Select Result --</option>
                <option value="walk">Walk</option>
                <option value="sacrifice-bunt">Sacrifice Bunt</option>
                <option value="hit-by-pitch">Hit By Pitch</option>
                <option value="defensive-interference">Interfered By D</option>
                <option value="hit">Hit</option>
                <option value="ground-out">Ground Out</option>
                <option value="strikeout">Strikeout</option>
                <option value="fly-out">Fly Out</option>
                <option value="fielders-choice">Fielder's Choice</option>
                <option value="reach-on-error">Reach on Error</option>
            </select>
        </td>
    `;
}

function populateLineup(tableId) {
    const tbody = document.getElementById(tableId);
    tbody.innerHTML = "";

    for (let i = 0; i < 9; i++) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><input type="text" class="player-name" placeholder="Player"></td>
            <td><input type="text" class="player-pos" placeholder="Pos"></td>
            ${Array(9).fill(createInningCell()).join("")}
            <td class="total-runs">0</td>
        `;

        tbody.appendChild(row);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    populateLineup("lineup-body-ht");
    populateLineup("lineup-body-at");
});