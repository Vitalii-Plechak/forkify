import { TIMEOUT_SEC } from './config.js';

/**
 * Throw timeout error
 * @param {number} s
 * @returns {Promise<unknown>}
 */
const timeout = function (s = TIMEOUT_SEC) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} ${s >= 2 ? 'seconds' : 'second'}`))
    }, s * 1000)
  })
}

/**
 * Get JSON
 * @param {string} url
 * @returns {Promise<*>}
 */
export const getJSON = async function(url) {
  try {
    const res = await Promise.race([fetch(url), timeout()]);
    const recipeResponseData = await res.json();
    
    if (!res.ok) throw new Error(`${recipeResponseData?.message} (${recipeResponseData?.status})`);
    return recipeResponseData;
  } catch (err) {
    throw err;
  }
}

/**
 * Send JSON
 *
 * @param {string} url
 * @param {object} uploadData
 * @returns {Promise<any>}
 */
export const sendJSON = async function(url, uploadData) {
  try {
    const sendData = fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uploadData)
    });
    const res = await Promise.race([sendData, timeout()]);
    const responseData = await res.json();
    
    if (!res.ok) throw new Error(`${responseData?.message} (${responseData?.status})`);
    return responseData;
  } catch (err) {
    throw err;
  }
}