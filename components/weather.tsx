"use client"

import React, { useEffect, useState } from 'react';
import { Sun, Cloud, Wind, Droplet, Thermometer, Gauge } from 'lucide-react';
import axios from 'axios';

// Interface for the weather data structure
interface WeatherData {
    name: string;
    main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    description: string;
  }[];
  wind: {
    speed: number;
  };
}

const getWeatherIcon = (description: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'sunny': <Sun className="text-yellow-500" size={48} />,
      'scattered clouds': <Cloud className="text-gray-400" size={48} />,
      'clear sky': <Sun className="text-yellow-500" size={48} />,
      'cloudy': <Cloud className="text-gray-500" size={48} />
    };
    return iconMap[description.toLowerCase()] || <Cloud size={48} />;
  };

const Weather: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=d1d108bddad838fe924af67c3b4ed8ff`
      );
      setWeatherData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className='h-screen flex items-center justify-center flex-col'>
        <div className='m-8'>
            <form onSubmit={handleSubmit}>
                    <div className="relative rounded-full overflow-hidden bg-white shadow-xl w-72">
                    <input
                        className="input bg-transparent outline-none border-none pl-6 pr-10 py-5 w-full font-sans text-lg font-semibold text-black"
                        placeholder="Get Weather"
                        name="text"
                        type="text"
                        value={city}
                        onChange={handleInputChange}
                    />
                    <div className="absolute right-2 top-[0.4em]">
                        <button type="submit" className="w-14 h-14 rounded-full bg-violet-500 group shadow-xl flex items-center justify-center relative overflow-hidden">
                            <svg
                                className="relative z-10"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 64 64"
                                height="50"
                                width="50"
                            >
                            <path
                            fill-opacity="0.01"
                            fill="white"
                            d="M63.6689 29.0491L34.6198 63.6685L0.00043872 34.6194L29.0496 1.67708e-05L63.6689 29.0491Z"
                            ></path>
                            <path
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-width="3.76603"
                            stroke="white"
                            d="M42.8496 18.7067L21.0628 44.6712"
                            ></path>
                            <path
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-width="3.76603"
                            stroke="white"
                            d="M26.9329 20.0992L42.85 18.7067L44.2426 34.6238"
                            ></path>
                            </svg>
                            <div className="w-full h-full rotate-45 absolute left-[32%] top-[32%] bg-black group-hover:-left-[100%] group-hover:-top-[100%] duration-1000"></div>
                            <div className="w-full h-full -rotate-45 absolute -left-[32%] -top-[32%] group-hover:left-[100%] group-hover:top-[100%] bg-black duration-1000"></div>
                        </button>
                    </div>
                    </div>

            </form>
      </div>
        {weatherData ? (
            <>
            
            <div className="">
      <div className="bg-white border-4 border-black p-8 w-full max-w-md space-y-6 shadow-[8px_8px_0_0_#000] transition-transform duration-500 ease-in-out transform hover:scale-105 hover:bg-gradient-to-b hover:from-gray-200 hover:to-white shadow-[8px_8px_0_0_#000] transition-shadow duration-500 ease-in-out hover:shadow-[12px_12px_0_0_#000]">
        <div className=" font-black flex items-center justify-between border-b-4 border-black pb-4">
          <div>
            <h1 className="text-6xl font-bold text-black">{weatherData.main.temp}°C</h1>    
            <p className="text-2xl uppercase font-bold text-black border-l-4 border-black pl-2 mt-2">{weatherData.weather[0].description}</p>
          </div>
          <div className="border-4 border-black p-2">
            {getWeatherIcon(weatherData.weather[0].description)}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-black">
          {[
            { Icon: Thermometer, label: 'Feels Like', value: `${weatherData.main.feels_like}°C` },
            { Icon: Droplet, label: 'Humidity', value: `${weatherData.main.humidity}%` },
            { Icon: Wind, label: 'Wind', value: `${weatherData.wind.speed} m/s` }
          ].map(({ Icon, label, value }) => (
            <div key={label} className="border-4 border-black p-4 text-center flex flex-col items-center">
              <Icon className="text-black mb-2" size={32} />
              <p className="uppercase text-xs font-bold mb-1">{label}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>
        
        <div className="border-4 border-black p-4 flex items-center text-black">
          <Gauge className=" mr-4" size={32} />
          <div>
            <p className="uppercase text-xs font-bold">Pressure</p>
            <p className="text-xl font-bold">{weatherData.main.pressure} hPa</p>
          </div>
        </div>
      </div>
    </div>
            </>
        ) : (
            <div className="w-full gap-x-2 flex justify-center items-center">
            <div
              className="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"
            ></div>
            <div
              className="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"
            ></div>
            <div
              className="w-5 h-5 animate-pulse bg-[#6756cc] rounded-full animate-bounce"
            ></div>
          </div>
            )}
    </div>
  );
};

export default Weather;