import * as functions from 'firebase-functions';
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
          long: res.data.features[0].center[0]
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