async function fetchQuestions(category) {
    let categoryId;
    if (category === "history") categoryId = 23;
    if (category === "islam") categoryId = 26; // Custom ID (use a different API if needed)
    if (category === "biology") categoryId = 17;

    const url = `https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results; // Returns an array of 10 questions
    } catch (error) {
        console.error("Error fetching questions:", error);
        return [];
    }
}
