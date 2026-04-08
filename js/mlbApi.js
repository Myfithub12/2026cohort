const MLBApi = (() => {

    const BASE_URL = "https://publicapi.io/mlb-records-and-stats-api";

    async function fetchMLB(endpoint = "") {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();
            console.log("MLB API Response:", data);
            return data;

        } catch (error) {
            console.error("MLB API Error:", error);
            return null;
        }
    }

    // -------------------------
    // TEAMS
    // -------------------------
    async function getTeams() {
        return await fetchMLB("/teams");
    }

    async function getRoster(teamId) {
        return await fetchMLB(`/teams/${teamId}/roster`);
    }

    // -------------------------
    // NEW: PLAYER STATS
    // -------------------------
    async function getPlayerStats(playerId) {
        return await fetchMLB(`/players/${playerId}/stats`);
    }

    // -------------------------
    // NEW: GAME SCHEDULE
    // -------------------------
    async function getGameSchedule(date = "") {
        // Example: /schedule?date=2024-05-01
        const query = date ? `?date=${date}` : "";
        return await fetchMLB(`/schedule${query}`);
    }

    // -------------------------
    // NEW: STANDINGS
    // -------------------------
    async function getStandings() {
        return await fetchMLB("/standings");
    }

    return {
        fetchMLB,
        getTeams,
        getRoster,
        getPlayerStats,
        getGameSchedule,
        getStandings
    };

})();