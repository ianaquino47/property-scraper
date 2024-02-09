<br/>
<p align="center">
  <h3 align="center">AirBnb Property Scraper</h3>

</p>



## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [About The Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation and Usage](#installation-and-usage)
  - [Tests](#tests)

## About The Project

This CLI tool scrapes an AirBnb property with its URL. The following information (if available) are parsed :
- Property name
- Property type (e.g. Apartment)
- Number of bedrooms
- Number of bathrooms
- List of amenities

## Built With

Node.js and Typescript

## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

This tool requires Node and Typescript. 

* node - [https://nodejs.org/en/download](https://nodejs.org/en/download)
* typescript

```sh
npm install typescript 
```

### Installation and Usage

1. Clone the repo

```sh
git clone git@github.com:ianaquino47/property-scraper.git
```

2. Install NPM packages

```sh
npm install
```

3. Compile and run the scraper

```sh
npm run build
npm start <airbnb_property_url>
```
### Tests


```sh
npm run test
```
