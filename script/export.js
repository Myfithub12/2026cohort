function exportToNotepad() {
    const text = document.getElementById("textToExport");

    // Format today's date as YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    // Filename becomes: export-2026-04-04.txt
    link.download = `export-${today}.txt`;

    link.click();
    URL.revokeObjectURL(url);
}