
// Github Link: https://jenishshrestha.github.io/leaflet-nepal/

// ===============================
// Nepal Map Interactive - Main JS
// ===============================
// This script initializes the Leaflet map, loads province and district data,
// and manages all interactivity for the Nepal map visualization.
//
// Each function is explained with comments for clarity.

var provinceMap, provinceGeoJson, stateGeoJson;


// Returns the name of a province given its number
function getProvinceName(province) {
  switch (province) {
    case 1:
      return "Province 1";
    case 2:
      return "Madhesh Province";
    case 3:
      return "Bagmati Province";
    case 4:
      return "Gandaki Province";
    case 5:
      return "Lumbini Province";
    case 6:
      return "Karnali Province";
    case 7:
      return "Sudurpashchim Province";
    default:
      return "Province " + province;
  }
}


// =====================
// Map Initialization
// =====================
// Creates the Leaflet map and disables some zoom controls for a focused experience.
provinceMap = L.map("map", {
  scrollWheelZoom: true,
  touchZoom: false,
  doubleClickZoom: false,
  zoomControl: true,
  dragging: true
}).setView([28.3949, 84.124], 8);


// =====================
// Add Province GeoJSON
// =====================
// Loads the province boundaries and adds them to the map with custom style and event handlers.
provinceGeoJson = L.geoJson(provinceData, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(provinceMap);



// Add tooltips to each province layer for better UX
provinceGeoJson.eachLayer(function (layer) {
  var provinceName = getProvinceName(layer.feature.properties.Province);
  // Store reference to tooltip for later control
  layer._provinceTooltip = layer.bindTooltip(provinceName, {
    permanent: true,
    direction: "center",
    className: 'province-tooltip'
  });
  // Add hover events for dynamic tooltip display after zoom
  layer.on('mouseover', function(e) {
    // Only show tooltip if it exists (not removed)
    if (layer._provinceTooltip) {
      layer.openTooltip();
    }
  });
  layer.on('mouseout', function(e) {
    // Only close tooltip if it exists and not in full map view
    if (layer._provinceTooltip && !isFullMapView()) {
      layer.closeTooltip();
    }
  });
});

// Helper to determine if map is in full province view (no districts shown)
function isFullMapView() {
  // If no district layer, or district layer is empty, we are in full map view
  return !stateGeoJson || (stateGeoJson && stateGeoJson.getLayers && stateGeoJson.getLayers().length === 0);
}

// Helper to show all province tooltips
function showAllProvinceTooltips() {
  provinceGeoJson.eachLayer(function(layer) {
    // If tooltip reference is missing (was deleted), rebind it
    if (!layer._provinceTooltip) {
      var provinceName = getProvinceName(layer.feature.properties.Province);
      layer._provinceTooltip = layer.bindTooltip(provinceName, {
        permanent: true,
        direction: "center",
        className: 'province-tooltip'
      });
    }
    layer.openTooltip();
  });
}


// Helper to hide only the clicked province tooltip and restore others
let lastClickedProvinceLayer = null;
function hideClickedProvinceTooltip(clickedLayer) {
  provinceGeoJson.eachLayer(function(layer) {
    // If this is the clicked province, hide its tooltip
    if (layer === clickedLayer && layer._provinceTooltip) {
      layer.closeTooltip();
      lastClickedProvinceLayer = layer;
    } else if (layer._provinceTooltip) {
      // For all other provinces, show their tooltip
      layer.openTooltip();
    }
  });
}


// Fit the map view to show all provinces
var bound = provinceGeoJson.getBounds();
provinceMap.fitBounds(bound);

/**
*  Functions for map
**/

// Returns the style object for each province (color, border, etc.)
function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: "#FFF",
    dashArray: "1",
    fillOpacity: 0.7,
    fillColor: getProvinceColor(feature.properties.Province)
  };
}


// Highlights a province when hovered

// Highlights a province when hovered and keeps tooltip visible
function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
    weight: 2,
    color: "black",
    dashArray: "",
    fillOpacity: 0.7,
    fillColor: "#fff"
  });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
  // Ensure tooltip stays visible on hover
  if (layer._provinceTooltip) {
    layer.openTooltip();
  }
}


// Returns a color for each province (used for fillColor)
function getProvinceColor(province) {
  switch (province) {
    case 1:
      return "red";
    case 2:
      return "green";
    case 3:
      return "blue";
    case 4:
      return "lightblue";
    case 5:
      return "lightgreen";
    case 6:
      return "yellow";
    case 7:
      return "orange";
    default:
      return "skyblue";
  }
}


// Resets province style when mouse leaves

// Resets province style and shows tooltip when mouse leaves
function resetHighlight(e) {
  provinceGeoJson.resetStyle(e.target);
  var layer = e.target;
  if (layer._provinceTooltip) {
    layer.openTooltip();
  }
}


// Zooms into a province and loads its districts when clicked

// Zooms into a province and loads its districts when clicked
function zoomToProvince(e) {
  var json,
    province_number = e.target.feature.properties.Province;
  var provinceName = getProvinceName(province_number);

  // Hide only the clicked province tooltip, show others
  hideClickedProvinceTooltip(e.target);

  // Zoom to the selected province
  provinceMap.fitBounds(e.target.getBounds());

  // Remove previous district layers if any
  if (stateGeoJson != undefined) {
    stateGeoJson.clearLayers();
  }

  // Load the correct district GeoJSON for the selected province
  switch (province_number) {
    case 1:
      json = province_1;
      break;
    case 2:
      json = province_2;
      break;
    case 3:
      json = province_3;
      break;
    case 4:
      json = province_4;
      break;
    case 5:
      json = province_5;
      break;
    case 6:
      json = province_6;
      break;
    case 7:
      json = province_7;
      break;
    default:
      json = "";
      break;
  }

  // Show reset button to return to full map
  const resetBtn = document.getElementById('resetMapView');
  if (resetBtn) {
    resetBtn.style.display = 'inline-block';
  }

  // Update info panel with province details
  updateInfoPanel({
    type: 'province',
    name: provinceName,
    number: province_number,
    capital: getProvinceCapital(province_number),
    color: getProvinceColor(province_number)
  });

  // Add districts as a new GeoJSON layer
  stateGeoJson = L.geoJson(json, {
    style: style,
    onEachFeature: onEachDistrictFeature
  }).addTo(provinceMap);

  // Bring district layer to front so its tooltips are above
  if (stateGeoJson && stateGeoJson.bringToFront) {
    stateGeoJson.bringToFront();
  }

  // Add tooltips to each district
  stateGeoJson.eachLayer(function (layer) {
    layer
      .bindTooltip(layer.feature.properties.DISTRICT, {
        permanent: true,
        direction: "center"
      })
      .openTooltip();
  });

  // If another province was previously clicked, restore its tooltip
  if (lastClickedProvinceLayer && lastClickedProvinceLayer !== e.target && lastClickedProvinceLayer._provinceTooltip) {
    lastClickedProvinceLayer.openTooltip();
  }

  lastClickedProvinceLayer = e.target;

  console.log(`Zoomed to ${provinceName} with districts`);
}


// Attaches event listeners to each province feature (hover, click)
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToProvince
  });
}


// Attaches event listeners to each district feature (hover, click)
function onEachDistrictFeature(feature, layer) {
  layer.on({
    // Highlight district on hover
    mouseover: function(e) {
      var layer = e.target;
      layer.setStyle({
        weight: 2,
        color: "#667eea",
        dashArray: "",
        fillOpacity: 0.6,
        fillColor: "#e8f4f8"
      });
    },
    // Reset style on mouse out
    mouseout: function(e) {
      if (stateGeoJson) {
        stateGeoJson.resetStyle(e.target);
      }
    },
    // Show district info on click
    click: function(e) {
      var districtName = e.target.feature.properties.DISTRICT || e.target.feature.properties.NAME || 'Unknown District';
      var provinceNumber = e.target.feature.properties.Province || e.target.feature.properties.PROVINCE || 1;
      updateInfoPanel({
        type: 'district',
        name: districtName,
        province: getProvinceName(provinceNumber),
        provinceNumber: provinceNumber,
        headquarters: getDistrictHeadquarters(districtName),
        color: getProvinceColor(provinceNumber)
      });
      console.log(`District selected: ${districtName}`);
    }
  });
}


// Returns the capital city for a given province number
function getProvinceCapital(provinceNum) {
  const capitals = {
    1: 'Biratnagar',
    2: 'Janakpur', 
    3: 'Hetauda',
    4: 'Pokhara',
    5: 'Deukhuri',
    6: 'Birendranagar',
    7: 'Godawari'
  };
  return capitals[provinceNum] || 'Unknown';
}

// Returns the headquarters for a given district name
function getDistrictHeadquarters(districtName) {
  const headquarters = {
    'Kathmandu': 'Kathmandu',
    'Bhaktapur': 'Bhaktapur',
    'Lalitpur': 'Lalitpur',
    'Chitwan': 'Bharatpur',
    'Kaski': 'Pokhara',
    'Morang': 'Biratnagar',
    'Jhapa': 'Bhadrapur',
    'Sunsari': 'Inaruwa',
    'Dhanusha': 'Janakpur',
    'Siraha': 'Siraha',
    'Saptari': 'Rajbiraj',
    'Mahottari': 'Jaleshwar',
    'Sarlahi': 'Malangwa',
    'Rautahat': 'Gaur',
    'Bara': 'Kalaiya',
    'Parsa': 'Birgunj',
    'Makwanpur': 'Hetauda',
    'Sindhuli': 'Sindhulimadi',
    'Ramechhap': 'Manthali',
    'Dolakha': 'Charikot',
    'Sindhupalchok': 'Chautara',
    'Kavrepalanchok': 'Dhulikhel',
    'Nuwakot': 'Bidur',
    'Rasuwa': 'Dhunche',
    'Dhading': 'Nilkantha'
  };
  return headquarters[districtName] || districtName;
}


// Updates the info panel with details about the selected province or district
function updateInfoPanel(data) {
  const infoContent = document.getElementById('infoContent');
  if (!infoContent) return;
  // Province info
  if (data.type === 'province') {
    infoContent.innerHTML = `
      <div class="province-info fade-in-up">
        <div class="info-title" style="background: ${data.color}; color: white; padding: 15px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h5 style="margin: 0; font-weight: 700;">${data.name}</h5>
          <small style="opacity: 0.9;">Province ${data.number}</small>
        </div>
        <div class="info-details">
          <div class="detail-item">
            <i class="bi bi-building text-primary"></i>
            <span class="label">Capital:</span>
            <span class="value">${data.capital}</span>
          </div>
          <div class="detail-item">
            <i class="bi bi-geo-alt text-primary"></i>
            <span class="label">Province:</span>
            <span class="value">Province ${data.number}</span>
          </div>
        </div>
        <div class="instruction-box">
          <i class="bi bi-cursor text-warning"></i>
          <p>Click on districts within this province to see detailed information</p>
        </div>
      </div>
    `;
  } else if (data.type === 'district') {
    // District info
    infoContent.innerHTML = `
      <div class="district-info fade-in-up">
        <div class="info-title" style="background: ${data.color}; color: white; padding: 15px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h5 style="margin: 0; font-weight: 700;">${data.name} District</h5>
          <small style="opacity: 0.9;">${data.province}</small>
        </div>
        <div class="info-details">
          <div class="detail-item">
            <i class="bi bi-building text-primary"></i>
            <span class="label">Headquarters:</span>
            <span class="value">${data.headquarters}</span>
          </div>
          <div class="detail-item">
            <i class="bi bi-map text-primary"></i>
            <span class="label">Province:</span>
            <span class="value">${data.province}</span>
          </div>
          <div class="detail-item">
            <i class="bi bi-hash text-primary"></i>
            <span class="label">Province No:</span>
            <span class="value">${data.provinceNumber}</span>
          </div>
        </div>
      </div>
    `;
  }
}

// Initializes the reset button to return to the full Nepal map view

document.addEventListener('DOMContentLoaded', function() {
  const resetBtn = document.getElementById('resetMapView');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      // Clear district layer
      if (stateGeoJson) {
        stateGeoJson.clearLayers();
      }
      // Reset to full Nepal view
      var bound = provinceGeoJson.getBounds();
      provinceMap.fitBounds(bound);
      // Show province tooltips again
      showAllProvinceTooltips();
      // Hide reset button
      resetBtn.style.display = 'none';
      // Reset info panel
      const infoContent = document.getElementById('infoContent');
      if (infoContent) {
        infoContent.innerHTML = `
          <div class="welcome-info">
            <div class="text-center mb-4">
              <i class="bi bi-map display-4 text-primary"></i>
            </div>
            <h5 class="text-center mb-3">Welcome to Nepal</h5>
            <p class="text-center text-muted mb-4">
              Explore Nepal's administrative divisions by clicking on provinces to see districts.
            </p>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">7</div>
                <div class="stat-label">Provinces</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">77</div>
                <div class="stat-label">Districts</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">753</div>
                <div class="stat-label">Municipalities</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">6,743</div>
                <div class="stat-label">Wards</div>
              </div>
            </div>
          </div>
        `;
      }
      console.log('Map reset to show all provinces');
    });
  }
});