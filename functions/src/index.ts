import * as functions from 'firebase-functions';
import * as moment from 'moment';
import axios from 'axios';

const key = functions.config().darksky.key;
const url = `https://api.darksky.net/forecast/${key}/`;

const mapBoxKey = functions.config().mapbox.key;

export const fetchWeather = functions.https.onCall((data, context) => {
  const coordinates = data;

  return axios.get(`${url}${coordinates.lat},${coordinates.long}`)
    .then(res => {
      return res.data;
    });
});

export const getLatLong = functions.https.onCall((data, context) => {
  const mbUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${data}.json?access_token=${mapBoxKey}&limit=1`;

  return axios.get(mbUrl)
    .then(res => {
      if(res.data.features.empty)
        throw new Error(`No coordinates found for ${data}`);

      return {
          lat: res.data.features[0].center[1],
          long: res.data.features[0].center[0],
          placeName: res.data.features[0].place_name
      }
    })
});

export const getLocation = functions.https.onCall((data, context) => {
  const mbUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${data.long},${data.lat}.json?access_token=${mapBoxKey}&limit=1`;
  return axios.get(mbUrl)
    .then(res => {
      return res.data;
    })
});

export const getStockPrices = functions.https.onCall((data, context) => {
  const {ticker} = data;
  const now = moment();
  const past = moment().subtract(1, 'years');
  const format = 'YYYY-d-M'

  return axios.get(`https://api.tiingo.com/tiingo/daily/${ticker}/prices?
    token=${functions.config().tiingo.key}
    &startDate=${now.format(format)}&endDate=${past.format(format)}`)
    .then((res) => {
      return res.data;
    }).catch((err) => {
      return err;
    });
});

//https://api.tiingo.com/tiingo/daily/<ticker>/prices
//https://api.tiingo.com/tiingo/daily/<ticker>/prices?startDate=2012-1-1&endDate=2016-1-1 
