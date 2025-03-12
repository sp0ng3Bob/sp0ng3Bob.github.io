const ddg = require("duck-duck-scrape");

async function getImages(query) {
    try {
        const results = await ddg.image(query);
        return results;
    } catch (error) {
        console.error("Error fetching results:", error);
    }
}

module.exports = getImages;