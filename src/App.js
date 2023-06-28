import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import axios from 'axios';

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [bgColor, setBgColor] = useState('');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
  const [inputCity, setInputCity] = useState('');
  const [error, setError] = useState('');

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=9293e96f103f3e20740e7432c5947c41`;

  const searchLocation = (e) => {
    if (e.key === 'Enter') {
      setShowWeather(false);
      setLoading(true);
      setBgColor('#333');
      setCity(inputCity);
      fetchBackgroundImage(inputCity);
    }
  };

  useEffect(() => {
    fetchRandomBackgroundImage(); // Fetch a random background image when the component mounts
  }, []);

  useEffect(() => {
    setError('');
    setLoading(true);
    setShowWeather(false);

    if (city) {
      axios
        .get(url)
        .then((res) => {
          setWeatherData(res.data);
          setLoading(false);
          setShowWeather(true);
          fetchBackgroundImage(city);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setShowWeather(false);
          setError('City does not exist, please enter another city');
        });
    }
  }, [url, city]);

  const fetchRandomBackgroundImage = async () => {
    try {
      const response = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          query: 'city',
          client_id: '-x4nHxC0NzcnYHQrbdVUGBWR8GxzGSR_NcidE8eZqYQ',
          orientation: 'landscape',
        },
      });

      setBackgroundImageUrl(`url(${response.data.urls.regular})`);
    } catch (error) {
      console.log('Error fetching random city image:', error);
      setBgColor('linear-gradient(to bottom, #fff 0%, #fff 100%)');
    }
  };

  const fetchBackgroundImage = async (cityName) => {
    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: cityName,
          client_id: '-x4nHxC0NzcnYHQrbdVUGBWR8GxzGSR_NcidE8eZqYQ',
          orientation: 'landscape',
          per_page: 1,
        },
      });

      if (response.data.results.length > 0) {
        setBackgroundImageUrl(`url(${response.data.results[0].urls.regular})`);
      } else {
        fetchRandomBackgroundImage(); // Fetch a random image if no results found for the search query
      }
    } catch (error) {
      console.log('Error fetching image:', error);
    }
  };

  return (
    <Router>
      <div
        className="App"
        style={{
          backgroundImage: backgroundImageUrl,
          height: "100vh",
          width: "100vw",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: bgColor
        }}
      >
        <div className="stats-container">
          <div className="search">
            <input
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              onKeyDown={searchLocation}
              placeholder="Enter a location"
              type="text"
            />
            <button><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1.5em"
              width="1.5em" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z">
              </path>
            </svg></button>
          </div>
          {error && <p>{error}</p>}
          {showWeather && (
            <div className="weather-container">
              <div className='cityName'>Weather in {weatherData.name}</div>
              <div>
                {weatherData.main ? (
                  <h1>{weatherData.main.temp}°F</h1>
                ) : null}
              </div>
              <div>
                <img
                  src={`https://openweathermap.org/img/wn/${
                    weatherData.weather ? weatherData.weather[0].icon : ''
                  }.png`}
                  alt=""
                  className="icon"
                />
                {weatherData.weather ? (
                  <p className="description">
                    {weatherData.weather[0].description.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")}
                  </p>
                ) : null}
              </div>
              <div>
                {weatherData.weather ? (
                  <p>Humidity: {weatherData.main.humidity}%</p>
                ) : null}
              </div>
              <div>
                {weatherData.weather ? (
                  <p>Wind Speed: {weatherData.wind.speed} mph</p>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;