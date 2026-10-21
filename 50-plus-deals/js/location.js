async function updateAllCityElements() {
  // Find every element with class "user-city" on the page
  const cityElements = document.querySelectorAll('.user-city');
  if (cityElements.length === 0) return;

  const providers = [
    async () => {
      const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
      const data = await res.json();
      return data.city;
    },
    async () => {
      const res = await fetch('https://freeipapi.com/api/json');
      const data = await res.json();
      return data.cityName;
    },
    async () => {
      const res = await fetch('https://ipinfo.io/json');
      const data = await res.json();
      return data.city;
    }
  ];

  let detectedCity = null;

  for (const fetchCity of providers) {
    try {
      const city = await fetchCity();
      if (city && city.trim() !== '') {
        detectedCity = city;
        break;
      }
    } catch (err) {}
  }

  // Update every instance found on the page
  cityElements.forEach(el => {
    el.textContent = detectedCity || 'Location Unavailable';
  });
}

// Call this after inserting your modal HTML
updateAllCityElements();