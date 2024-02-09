import airBnbScraper from "./scrapers/airBnbScraper";

const [url] = process.argv.slice(2);
airBnbScraper(url);
