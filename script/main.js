async function exportToNotepad() {
    let txtContent = "Team,Player,Pos,1,2,3,4,5,6,7,8,9,Total\n";

    function scrapeTeam(tbodyId, teamName) {
        const rows = document.querySelectorAll(`#${tbodyId} tr`);
        let output = "";

        rows.forEach(row => {
            const cells = row.querySelectorAll("td");

            const rowValues = Array.from(cells).map(cell => {
                const input = cell.querySelector("input");
                const select = cell.querySelector("select");

                if (select) return select.value;
                if (input) return input.value;

                return cell.innerText;
            });

            output += `${teamName},` + rowValues.join(",") + "\n";
        });

        return output;
    }
        txtContent += scrapeTeam("lineup-body-ht", "Home");
    txtContent += "\n";
    txtContent += scrapeTeam("lineup-body-at", "Away");

    // Changed from CSV to TXT
    const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Changed filename extension
    a.download = "baseball_scorecard.txt";

    a.click();
    URL.revokeObjectURL(url);
}

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

let ballCount = 0;
let strikeCount = 0;

function render() {
    document.getElementById("balls").textContent = "●".repeat(ballCount);
    document.getElementById("strikes").textContent = "●".repeat(strikeCount);
}

function addBall() {
    if (ballCount < 3) ballCount++;
    render();
}

function addStrike() {
    if (strikeCount < 2) strikeCount++;
    render();
}

function addFoul() {
    if (strikeCount < 2) strikeCount++;
    render();
}