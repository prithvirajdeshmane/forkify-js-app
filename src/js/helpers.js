import { FETCH_TIMEOUT_SECONDS } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// export const getJSON = async function (url) {
//   try {
//     const fetchPromise = await fetch(url);
//     const res = await Promise.race([
//       fetchPromise,
//       timeout(FETCH_TIMEOUT_SECONDS),
//     ]);
//     const resJson = await res.json();

//     if (!res.ok) throw new Error(`${resJson.message} : (${res.status})`);

//     return resJson;
//   } catch (error) {
//     throw error;
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPromise = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });

//     const res = await Promise.race([
//       fetchPromise,
//       timeout(FETCH_TIMEOUT_SECONDS),
//     ]);
//     const resJson = await res.json();

//     if (!res.ok) throw new Error(`${resJson.message} : (${res.status})`);

//     return resJson;
//   } catch (error) {
//     throw error;
//   }
// };

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([
      fetchPromise,
      timeout(FETCH_TIMEOUT_SECONDS),
    ]);
    const resJson = await res.json();

    if (!res.ok) throw new Error(`${resJson.message} : (${res.status})`);

    return resJson;
  } catch (error) {}
};
