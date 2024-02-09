import airBnbScraper from "../../src/scrapers/airBnbScraper";

describe("airBnbScraper", () => {
  test("Throws an error if url is not provided", async () => {
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const processExitMock = jest
      .spyOn(process, "exit")
      .mockImplementation((code) => {
        throw new Error();
      });

    await expect(async () => {
      await airBnbScraper(null);
    }).rejects.toThrow();

    expect(consoleErrorMock).toHaveBeenCalledWith(
      "Please provide a valid URL of a property on AirBnb."
    );
  });
});
