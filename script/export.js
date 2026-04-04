function exportToNotepad() {
    const text = document.getElementById("textToExport").value;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "export.txt";
    link.click();

    URL.revokeObjectURL(url);
}