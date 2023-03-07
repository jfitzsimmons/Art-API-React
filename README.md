# Art-API-React

A demo using the React Library with multiple external APIs. Style, Information and GPS are all contextual, based on one or more search terms for paintings.

[![Art API React Image](https://raw.githubusercontent.com/jfitzsimmons/Art-Api-React/master/preview.png)](https://jfitzsimmons.github.io/Art-API-React/ 'Art API Link')

**Explanation**  
This is a newer version of an older project. I was looking for a way to demo React using multiple APIs. It was a struggle at times to make the data between these API's available and relevant to each other while delivering an intuitive experience. Hopefully the overall idea comes through.

## Installation

### Prerequisites

yarn (or npm): [yarn](https://yarnpkg.com/)

git: [git](https://git-scm.com/)

### Steps

Navigate to your chosen directory and clone the gallery.

```bash
git clone https://github.com/jfitzsimmons/Art-Api-React.git

cd Art-Api-React

yarn
yarn build
yarn start
```

## Deploy

### Prerequisites

You'll need a Github account: [create account](https://github.com/join)

Update homepage in package.json to your own

```
"homepage": "https://yourhandle.github.io/Art-Api-React/",
```

```bash
yarn deploy
```

### APIs Used

- [Harvard Art Museums API](https://github.com/harvardartmuseums/api-docs) - The Harvard Art Museums API is a REST-style service designed for developers who wish to explore and integrate the museums’ collections in their projects.
- [GeoNames Wikipedia Webservice](https://geocode.maps.co/) - This geocoding API is provided to the public, for free, as a community service by MAPS, a web-based GIS & map making too
- [MediaWiki Action API](https://www.mediawiki.org/wiki/API:Main_page) - The MediaWiki Action API is a web service that allows access to some wiki features like authentication, page operations, and search.

### Built With

- [Create React App](https://github.com/facebook/create-react-app) - Set up a modern web app by running one command.
- [SASS](https://sass-lang.com/) - Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.
- [Leaflet](https://leafletjs.com/) - an open-source JavaScript library for mobile-friendly interactive maps
- [React Tags](https://github.com/prakhar1989/react-tags) - A fantastically simple tagging component for your React projects
- [Google Fonts](https://fonts.google.com/) - Making the web more beautiful, fast, and open through great typography

## Current State

- Add TypeScript
