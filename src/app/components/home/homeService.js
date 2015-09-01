angular
	.module("app")
	.factory("Weather", Weather);

function Weather() {
	var data = {
		"city": {
			"id" : 228,
			"name" : "Ghetto"
		},
		"list": [
			{
				'dt': 4242342,
				'main': {
					"temp": 23,
					"humidity": 52,
					"tempForecast": 12
				},
				"waether" : {
					"main": "Clear",
					'desc': "Sky is clear"
				},
				"wind":{
					"speed":2.32,
					"deg":336.509
				},
			}
		]
	};
	var weatherList = data.list;

	function getDate() {
		return data.list[0].dt;
	}

	function getCity() {
		return data.city.name;
	}

	function getTempAndHumidity(date) {
		var temperature, // seems that this vars should have default value for correct behavior
				humidity,	 // but for now we're sure that will find values in data
				tempForecast,
				dayPart;

		weatherList.forEach( function (item, i) {
			if (item.dt === date) {
				temperature = item.main.temp;
				humidity = item.main.humidity;
				tempForecast = item.main.tempForecast;
			}
		});

		dayPart = (new Date()).getHours();

		if ((dayPart > 22) && (dayPart < 6)) {
			dayPart = "Day";
		} else {
			dayPart = "Night";
		}

		// console.log(dayPart);

		return {
			"temperature" : temperature,
			"humidity": humidity,
			"tempForecast": tempForecast,
			"dayPart": dayPart
		};
	}

	function getWind(date) {
		var speed,   // seems that this vars should have default value for correct behavior
			degree;  // but for now we're sure that will find values in data

		weatherList.forEach( function (item, i) {
			if (item.dt === date) {
				speed = item.wind.speed;
				degree = item.wind.deg;
			}
		});

		return {
			"speed": speed,
			"degree": degree
		};

	}

	return {
		getWind : getWind,
		getTempAndHumidity : getTempAndHumidity,
		getCity : getCity
	};
}