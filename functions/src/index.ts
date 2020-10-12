import * as functions from 'firebase-functions';
import * as moment from 'moment';
import axios from 'axios';


const dskey = functions.config().darksky.key;
const dsurl = `https://api.darksky.net/forecast/${dskey}/`;

const mbkey = functions.config().mapbox.key;
const tkey = functions.config().tiingo.key;

export const fetchWeather = functions.https.onCall((data, context) => {
  const coordinates = data;

  return axios.get(`${dsurl}${coordinates.lat},${coordinates.long}`)
    .then(res => {
      return res.data;
    });
});

export const getLatLong = functions.https.onCall((data, context) => {
  const mbUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${data}.json?access_token=${mbkey}&limit=1`;

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
  const mbUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${data.long},${data.lat}.json?access_token=${mbkey}&limit=1`;
  return axios.get(mbUrl)
    .then(res => {
      return res.data;
    })
});

export const getStockPrices = functions.https.onCall((data, context) => {
  const tickers = data.tickers;
  if(!tickers)
    throw new Error("Must supply tickers");

  const now = moment();
  const past = moment().subtract(1, 'months');
  const format = 'YYYY-M-D'

  let responses = new Array();
  for(let i = 0; i < tickers.length; i++) {
    responses.push(axios.get(`https://api.tiingo.com/tiingo/daily/${tickers[i]}/prices?token=${tkey}&startDate=${past.format(format)}&endDate=${now.format(format)}`)
      .then((res) => {
        return {
          ticker: tickers[i],
          prices: res.data
        };
      }).catch((err) => {
        return err;
      }))
  }

  return Promise.all(responses).then(prices => { return prices });
});

export const getStockMetaData = functions.https.onCall((data, context) => {
  try {
    const ticker = data.ticker;
    if(!ticker)
      throw new Error("Must supply ticker");

    return axios.get(`https://api.tiingo.com/tiingo/daily/${ticker}?token=${tkey}`)
      .then(res => {return res.data})
      .catch(e => {return "Invalid ticker"});

  } catch(e) {
    return e;
  }
});
