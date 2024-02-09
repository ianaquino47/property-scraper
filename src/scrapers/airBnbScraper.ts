import puppeteer from "puppeteer";
import { getPropertyDetails, goToPage } from "../utils/airBnbScraperUtils";
import pc from "picocolors";

const airBnbScraper = async (url: string | null): Promise<void> => {
  try {
    if (!url) {
      throw Error("Please provide a valid URL of a property on AirBnb.");
    }

    const browser = await puppeteer.launch();
    const page = await goToPage(url, browser);

    const {
      propertyName,
      propertyType,
      numberOfBedrooms,
      numberOfBathrooms,
      amenitiesList,
    } = await getPropertyDetails(page);

    console.log(`${pc.bold("Property Name:")} ${pc.red(propertyName)}`);
    console.log(`${pc.bold("Property Type:")} ${pc.red(propertyType)}`);
    console.log(`${pc.bold("No. of bedrooms:")} ${pc.red(numberOfBedrooms)}`);
    console.log(`${pc.bold("No. of bathrooms:")} ${pc.red(numberOfBathrooms)}`);
    console.log(`${pc.bold("Amenities:")}`);
    amenitiesList.forEach((amenity) => {
      console.log(` - ${pc.red(amenity)}`);
    });

    browser.close();
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }
};

export default airBnbScraper;
