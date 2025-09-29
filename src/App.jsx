import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city) return;
    // console.log(API_KEY);
    setLoading(true);
    setError("");
    setWeather(null);
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod !== 200) {
        throw new Error(data.message || "Error fetching weather");
      }

      setWeather({
        city: data.name,
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        description: data.weather[0].description,
        icon: data.weather[0].icon, 
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-500 p-6">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-4">
          🌦 Weather Now
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Get Weather
          </button>
        </form>

        {loading && <p className="text-center text-gray-600 mt-4">Loading...</p>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        {weather && (
          <div className="mt-6 bg-blue-100 p-6 rounded-xl shadow-inner text-center">
          
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="mx-auto mb-2"
            />

      
            <h2 className="text-2xl font-semibold text-blue-800">
              {weather.city}
            </h2>
            <p className="text-lg text-gray-700">
              🌡 {weather.temp}°C (Feels like {weather.feels_like}°C)
            </p>
            <p className="capitalize text-gray-600">🌤 {weather.description}</p>


            <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
              <div className="bg-white rounded-lg p-3 shadow">
                💧 Humidity: {weather.humidity}%
              </div>
              <div className="bg-white rounded-lg p-3 shadow">
                🌬 Wind: {weather.windSpeed} m/s
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
