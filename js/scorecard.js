const Scorecard = {
    storageKey: "myScorecardData",

    save(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    },

    load() {
        const raw = localStorage.getItem(this.storageKey);
        return raw ? JSON.parse(raw) : null;
    },

    exportScorecardToTxt() {
        const data = this.load();
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
        a.click();

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