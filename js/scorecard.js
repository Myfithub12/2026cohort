const Scorecard = {
    storageKey: "myScorecardData",

    save(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    },

    load() {
        const raw = localStorage.getItem(this.storageKey);
        return raw ? JSON.parse(raw) : null;
    },

    saveToLocalStorage() {
        const data = {
            homeTeam: document.querySelector('input[title="Home Team"]')?.value || "",
            awayTeam: document.querySelector('input[title="Away Team"]')?.value || "",
            homeLineup: Scorecard.getLineup("lineup-body-ht"),
            awayLineup: Scorecard.getLineup("lineup-body-at"),
            ballsHome: window.ballsHomeCount || 0,
            strikesHome: window.strikesHomeCount || 0,
            ballsAway: window.ballsAwayCount || 0,
            strikesAway: window.strikesAwayCount || 0
        };

        this.save(data);
        console.log("Scorecard saved to local storage");
        return data;
    },

    saveAndExport() {
        const data = this.saveToLocalStorage();
        this.exportScorecardToTxt(data);
    },

    exportScorecardToTxt(data) {
        if (!data) {
            alert("No scorecard data found.");
            return;
        }

        const text = JSON.stringify(data, null, 2);
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "scorecard.txt";

        document.body.appendChild(a);   // required for Chrome
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    },

    async loadTeams() {
        const teams = await MLBApi.getTeams();
        console.log("Loaded MLB Teams:", teams);
        return teams;
    },

    async loadPlayerStats(playerId) {
        const stats = await MLBApi.getPlayerStats(playerId);
        console.log("Player Stats:", stats);
        return stats;
    },

    async loadSchedule(date) {
        const schedule = await MLBApi.getGameSchedule(date);
        console.log("Game Schedule:", schedule);
        return schedule;
    },

    async loadStandings() {
        const standings = await MLBApi.getStandings();
        console.log("MLB Standings:", standings);
        return standings;
    }
};