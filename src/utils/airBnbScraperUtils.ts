import { Browser, Page } from "puppeteer";

const selectors = {
  propertyName: "h1.i1pmzyw7",
  propertyType: ".toieuka h1",
  propertySpecification: ".o1kjrihn li",
  amenitiesButton: ".b9672i7 button",
  amenitiesList: "ul._2f5j8p",
};

const goToPage = async (url: string, browser: Browser): Promise<Page> => {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });

  // puppeteer navigates to a 404 page successfully if room does not exist
  if ((await page.title()).includes("404")) {
    throw Error("This room does not exist.");
  }

  return page;
};

const getPropertyName = async (page: Page): Promise<string> => {
  return await page.$eval(
    selectors.propertyName,
    (element) => element.textContent?.trim() || ""
  );
};

const getPropertyType = async (page: Page): Promise<string> => {
  return await page.$eval(
    selectors.propertyType,
    (element) => element.textContent?.trim().split(" in ")[0] || ""
  );
};

const getPropertySpecification = async (page: Page): Promise<string[]> => {
  return await page.$$eval(selectors.propertySpecification, (nodes) => {
    return nodes.reduce((acc, element) => {
      if (element.textContent) {
        acc.push(element.textContent);
      }

      return acc;
    }, [] as string[]);
  });
};

const getBedroomInfo = (specification: string[]): string => {
  const info = specification.find(
    (info) => info.includes("bedroom") || info.includes("bed")
  );

  return info ? info.replace(/[^0-9]/g, "") : "";
};

const getBathroomInfo = (specification: string[]): string => {
  const info = specification.find((info) => info.includes("bathroom"));

  if (!info) return "";

  return info.includes("Shared") ? "1 (shared)" : info.replace(/[^0-9]/g, "");
};

const getAmenitiesInfo = async (page: Page): Promise<string[]> => {
  await page.$eval(selectors.amenitiesButton, (button) => {
    (button as HTMLButtonElement).click();
  });

  await page.waitForSelector(selectors.amenitiesList, { visible: true });

  return await page.$$eval(selectors.amenitiesList, (elements) => {
    return elements.reduce((acc: string[], section): string[] => {
      const list = [...section.childNodes];
      const sectionItems = list
        .filter((item, index) => {
          return (
            item.textContent !== "Not included" &&
            !item.textContent?.includes("Unavailable:")
          );
        })
        .map((item) => {
          return item.textContent?.trim() ?? "";
        });

      return [...acc, ...sectionItems];
    }, []);
  });
};

type PropertyDetails = {
  propertyName: string;
  propertyType: string;
  numberOfBedrooms: string;
  numberOfBathrooms: string;
  amenitiesList: string[];
};

const getPropertyDetails = async (page: Page): Promise<PropertyDetails> => {
  const propertyName = await getPropertyName(page);
  const propertyType = await getPropertyType(page);
  const specification = await getPropertySpecification(page);
  const numberOfBedrooms = getBedroomInfo(specification);
  const numberOfBathrooms = getBathroomInfo(specification);
  const amenitiesList = await getAmenitiesInfo(page);

  return {
    propertyName,
    propertyType,
    numberOfBedrooms,
    numberOfBathrooms,
    amenitiesList,
  };
};

export {
  goToPage,
  getPropertyName,
  getPropertyType,
  getPropertySpecification,
  getBedroomInfo,
  getBathroomInfo,
  getAmenitiesInfo,
  getPropertyDetails,
};
