import React, {useState, useRef} from 'react';
import "./weatherApp.css"
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";
import bg_image from "../assets/bg.jpeg";


const WeatherApp = () => {
    let api_key = "653a87efb7f75a574643e7a9486bb57b";
    const [weatherData, setWeatherData] = useState(null);
    const inputValue = useRef(null);
    const [isError, setIsError] = useState(false);
    const [wicon, setWicon] = useState(clear_icon);
    const [isLoading, setIsLoading] = useState(null);

    const handleWeatherImage = () => {
        if(weatherData){
            switch (weatherData.weather[0].main.toLowerCase()) {
                case "clear":
                    setWicon(clear_icon);
                    break;
                case "clouds":
                    setWicon(cloud_icon);
                    break;
                case "drizzle":
                    setWicon(drizzle_icon);
                    break;
                case "rain":
                    setWicon(rain_icon);
                    break;
                case "snow":
                    setWicon(snow_icon);
                    break;
                default:
                    setWicon(clear_icon);
                    break;
            }
        }
       
       
    }
    const search = async (e) => {
        e.preventDefault();
        if(!inputValue.current.value.trim()) {
            setWeatherData(null);
            return
        }

        let value = inputValue.current.value;
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${value}&units=metric&appid=${api_key}`;

        setIsLoading(true);

        let response = await fetch(url);
        if (response.ok) { 
            let data = await response.json();
            setWeatherData(data);
            setIsError(false);
            await handleWeatherImage();
        } 
        else {
            console.error("City not found", response);
            setIsError(true);   
            setWeatherData(null); 
        }
        //reset input value
        inputValue.current.value = "";
        setIsLoading(false);
    }

    return (
        <div className='container'>
            <img src={bg_image} alt="bg" className='bg-img' />
           <form className="top-bar" onSubmit={(e) => {search(e)}}>
                <input ref={inputValue} type="text" className="cityInput" placeholder='City name'/>
                <button className="search-icon" >
                     <img src={search_icon} alt="search-icon" /> 
                </button>
                {isError && !isLoading &&
                    <h1 className='big-heading'>Please insert correct location</h1>}
           </form>
           {!isError && weatherData && !isLoading &&  
           <div className="">
                <div className="weather-location">{weatherData.name}</div>
                <div className="weather-temp">{Math.floor(weatherData.main.temp)} °c</div>
                <div className="weather-image">
                    <img src={wicon} alt="cloud-icon" /> 
                    <p>{weatherData.weather[0].description}</p>
                </div>
                <div className="weather-temp--scale">
                        <span>Max: {Math.floor(weatherData.main.temp_max)} °c</span>
                        <span>Min: {Math.floor(weatherData.main.temp_min)} °c</span>
                </div>
                <div className="data-container">
                        <div className="element">
                            <img src={humidity_icon} alt="" className="icon" />
                            <div className="data">
                                <div className="humidity-percent">{weatherData.main.humidity} %</div>
                                <div className="text">Humidity</div>
                            </div>
                        </div>
                        <div className="element">
                            <img src={wind_icon} alt="" className="icon" />
                            <div className="data">
                                <div className="humidity-percent">{weatherData.wind.speed} km/h</div>
                                <div className="text">Wind Speed</div>
                            </div>
                        </div>
                </div>
           </div> 
           }

           {isLoading && <h1 className='big-heading'>Weather data is loading</h1>}
        </div>
    );
}

export default WeatherApp;
