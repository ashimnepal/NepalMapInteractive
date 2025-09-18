
<img width="1361" height="606" alt="image" src="https://github.com/user-attachments/assets/01b0263d-4e68-4e64-8e46-3ac7bb2f3a9c" />


# Nepal Map Interactive

This project is an interactive web application that visualizes the map of Nepal, allowing users to explore its provinces and districts. The application is built using HTML, CSS, and JavaScript, and leverages the Leaflet.js library for map rendering and interactivity.

## Features

- **Interactive Map**: Displays a map of Nepal with clickable provinces and districts.
- **Province and District Layers**: Each province and its districts are represented as separate layers, making it easy to explore administrative divisions.
- **Custom Styling**: The map uses custom CSS for a visually appealing interface.
- **Responsive Design**: The layout is designed to work well on both desktop and mobile devices.

## Project Structure

```
index.html                # Main HTML file
css/
  leaflet.css             # Leaflet library CSS
  style.css               # Custom styles for the map and UI
js/
  leaflet.js              # Leaflet library JS
  nepal-province.js       # GeoJSON or JS data for Nepal's provinces
  province1-district.js   # District data for Province 1
  province2-district.js   # District data for Province 2
  province3-district.js   # District data for Province 3
  province4-district.js   # District data for Province 4
  province5-district.js   # District data for Province 5
  province6-district.js   # District data for Province 6
  province7-district.js   # District data for Province 7
  script.js               # Main JavaScript logic for map interactivity
```

## How It Works

1. **Map Initialization**: The map is initialized in `index.html` using Leaflet.js.
2. **Province and District Data**: JavaScript files in the `js/` folder provide the GeoJSON or JavaScript objects for provinces and districts.
3. **Interactivity**: The `script.js` file handles user interactions, such as clicking on provinces to reveal districts.
4. **Styling**: The `css/` folder contains styles for the map and UI elements.

## Getting Started

1. Clone or download this repository.
2. Open `index.html` in your web browser.
3. Explore the interactive map of Nepal!

## Dependencies

- [Leaflet.js](https://leafletjs.com/) (included locally in the `js/` and `css/` folders)

## Credits

This project is inspired by and uses map data from [Jenish Shrestha's Leaflet Nepal project](https://jenishshrestha.github.io/leaflet-nepal/). Special thanks to Jenish Shrestha for providing the original map and license to use and adapt it for this interactive application.

## License

This project is for educational and demonstration purposes.
