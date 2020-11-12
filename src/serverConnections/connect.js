
/**
 * 
 * @param {*} url 
 * @param {*} data 
 */
export async function postData(url = '', jwt, data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'auth-token': jwt
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  })
  return response;
}

/**
 * 
 * @param {*} url 
 * @param {*} data 
 */
export async function patchData(url = '', jwt, data = {}) {
  const response = await fetch(url, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': jwt
    },
    body: JSON.stringify(data)
  })
  return response;
}

/**
 * 
 * @param {*} url 
 * @param {*} data 
 */
export async function deleteData(url = '', jwt) {
  const response = await fetch(url, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': jwt
    },
  })
  return response;
}
