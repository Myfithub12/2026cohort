const MLBApi = (() => {

    const BASE_URL = "https://app.balldontlie.io/api/v1/mlb";
    const API_KEY = "660f9614-491d-46bd-9bbf-9ebe5350cc80";

    async function fetchMLB(endpoint = "") {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`, {
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

    async function getTeams() {
        return await fetchMLB("/teams");
    }

    async function getRoster(teamId) {
        return await fetchMLB(`/teams/${teamId}/roster`);
    }

    async function getPlayerStats(playerId) {
        return await fetchMLB(`/players/${playerId}/stats`);
    }

    async function getGameSchedule(date = "") {
        const query = date ? `&date=${date}` : "";
        return await fetchMLB(`/games${query}`);
    }

    async function getStandings() {
        return await fetchMLB("/standings");
    }

    async function getMiLBTeams(level = "aaa") {
        return await fetchMLB(`/milb/${level}/teams`);
    }

    async function getMiLBRoster(level, teamId) {
        return await fetchMLB(`/milb/${level}/teams/${teamId}/roster`);
    }

    async function getMiLBStandings(level = "aaa") {
        return await fetchMLB(`/milb/${level}/standings`);
    }

    async function getMiLBSchedule(level = "aaa", date = "") {
        const query = date ? `&date=${date}` : "";
        return await fetchMLB(`/milb/${level}/games${query}`);
    }

    return {
        fetchMLB,

        // MLB
        getTeams,
        getRoster,
        getPlayerStats,
        getGameSchedule,
        getStandings,

        // MiLB
        getMiLBTeams,
        getMiLBRoster,
        getMiLBStandings,
        getMiLBSchedule
    };

})();