
export default function parseCsv(csv) {
    if (typeof csv !== "string") {
        throw new Error("csv must be a string");
    }
    const headers = csv
        .split("\n")[0].split(","); // ["Nom", "Prénom", "Email"]
    return csv
        .split("\n")
        .slice(1)
        .map(
            (row) => row.split(",") // ["Alice", "Bob", "alice.bob@domain"]
        )
        .map(
            row => headers.reduce((acc, cur, i) => ({ ...acc, [cur]: row[i] }),
                {}
            ));
}