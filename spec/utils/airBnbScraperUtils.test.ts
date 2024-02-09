import {
  goToPage,
  getPropertyName,
  getPropertyType,
  getPropertySpecification,
  getBedroomInfo,
  getBathroomInfo,
  getAmenitiesInfo,
} from "../../src/utils/airBnbScraperUtils";

import { Browser, Page } from "puppeteer";

describe("goToPage", () => {
  const stubBrowser = (page: Page) => {
    return {
      newPage() {
        return Promise.resolve(page);
      },
    } as unknown as Browser;
  };

  test("throws an error if page is a 404 page", () => {
    const stub404Page = {
      goto(url: string) {
        return Promise.resolve();
      },
      title() {
        return "404";
      },
    } as unknown as Page;

    expect(async () => {
      await goToPage("test-url", stubBrowser(stub404Page));
    }).rejects.toThrow();
  });

  test("Returns the page", async () => {
    const stubPage = {
      goto(url: string) {
        return Promise.resolve();
      },
      title() {
        return "Amazing Flat!";
      },
    } as unknown as Page;

    const result = await goToPage("test-url", stubBrowser(stubPage));
    expect(result).toBe(stubPage);
  });
});

describe("getPropertyName", () => {
  test("returns a trimmed string if element has textContent", async () => {
    const element = {
      textContent: "   test   ",
    };
    const stubPage = {
      $eval(selector: string, pageFunction: any) {
        const result = pageFunction(element);
        return Promise.resolve(result);
      },
    } as unknown as Page;
    const propertyName = await getPropertyName(stubPage);
    expect(typeof propertyName).toBe("string");
    expect(propertyName).toEqual("test");
  });

  test("returns an empty string if there is no property name", async () => {
    const element = { textContent: null };
    const stubPage = {
      $eval(selector: string, pageFunction: any) {
        const result = pageFunction(element);
        return Promise.resolve(result);
      },
    } as unknown as Page;
    const propertyName = await getPropertyName(stubPage);
    expect(typeof propertyName).toBe("string");
    expect(propertyName).toEqual("");
  });
});

describe("getPropertyType", () => {
  test("Returns the property type string that is trimmed", async () => {
    const element = {
      textContent: "  Flat in Edinburgh  ",
    };
    const stubPage = {
      $eval(selector: string, pageFunction: any) {
        const result = pageFunction(element);
        return Promise.resolve(result);
      },
    } as unknown as Page;
    const propertyType = await getPropertyType(stubPage);
    expect(propertyType).toEqual("Flat");
  });

  test("returns an empty string if there is no property type", async () => {
    const element = { textContent: null };
    const stubPage = {
      $eval(selector: string, pageFunction: any) {
        const result = pageFunction(element);
        return Promise.resolve(result);
      },
    } as unknown as Page;
    const propertyType = await getPropertyType(stubPage);
    expect(propertyType).toEqual("");
  });
});

describe("getPropertySpecification", () => {
  test("returns an array of specifications", async () => {
    const stubPage = {
      $$eval(selector: string, pageFunction: any) {
        const elements = [
          {
            textContent: "2 guests",
          },
          {
            textContent: "1 bedroom",
          },
          {
            textContent: "1 bed",
          },
          {
            textContent: "1 bathroom",
          },
        ];
        const result = pageFunction(elements);
        return Promise.resolve(result);
      },
    } as unknown as Page;
    const propertySpecification = await getPropertySpecification(stubPage);
    expect(propertySpecification).toEqual([
      "2 guests",
      "1 bedroom",
      "1 bed",
      "1 bathroom",
    ]);
  });

  test("returns empty array if page does not have any specification", async () => {
    const stubPage = {
      $$eval(selector: string, pageFunction: any) {
        const elements: [] = [];
        const result = pageFunction(elements);
        return Promise.resolve(result);
      },
    } as unknown as Page;
    const propertySpecification = await getPropertySpecification(stubPage);
    expect(propertySpecification).toEqual([]);
  });
});

describe("getBedRoomInfo", () => {
  test("returns the number of bedrooms", () => {
    const specification = ["3 bedrooms"];
    expect(getBedroomInfo(specification)).toEqual("3");
  });
  test("returns the number of bedrooms if only bed information is available", () => {
    const specification = ["1 bed"];
    expect(getBedroomInfo(specification)).toEqual("1");
  });

  test("returns an empty string when there is no information available", () => {
    const specification = ["1 bathroom"];
    expect(getBedroomInfo(specification)).toEqual("");
  });
});

describe("getBathroomInfo", () => {
  test("returns the number of bathrooms", () => {
    const specification = ["3 bathrooms"];
    expect(getBathroomInfo(specification)).toEqual("3");
  });
  test("returns 1 (shared) if bathroom is shared", () => {
    const specification = ["Shared bathroom"];
    expect(getBathroomInfo(specification)).toEqual("1 (shared)");
  });

  test("returns an empty string when there is no information available", () => {
    const specification = ["1 bedroom"];
    expect(getBathroomInfo(specification)).toEqual("");
  });
});

describe("getAmenitiesInfo", () => {
  const stubPage = {
    $eval(selector: string, pageFunction: any) {
      return Promise.resolve();
    },
    waitForSelector(selector: string, options: any) {
      return Promise.resolve();
    },
    $$eval(selector: string, pageFunction: any) {
      const elements = [
        {
          childNodes: [
            { textContent: "Hair Dryer" },
            { textContent: "Shampoo" },
            { textContent: "Body Soap" },
            { textContent: "Shower gel" },
            { textContent: "Hot water" },
            { textContent: "Unavailable: Towels" },
          ],
        },
      ];
      const result = pageFunction(elements);
      return Promise.resolve(result);
    },
  } as unknown as Page;

  test("returns correct available amenities", async () => {
    const propertySpecification = await getAmenitiesInfo(stubPage);
    expect(propertySpecification).toEqual([
      "Hair Dryer",
      "Shampoo",
      "Body Soap",
      "Shower gel",
      "Hot water",
    ]);

    expect(propertySpecification.includes("Towels")).toBe(false);
  });
});
