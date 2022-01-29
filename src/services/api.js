exports.postReplay = async (data) => {
  const response = await fetch(
    "https://murmuring-island-07996.herokuapp.com/api/replays",
    {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    }
  );
  return response.json(); // parses JSON response into native JavaScript objects
};

exports.getReplay = async (filterObj) => {
  let searchParams = new URLSearchParams(filterObj);
  console.log(
    `fetch https://murmuring-island-07996.herokuapp.com/api/replays?${searchParams.toString()} `
  );
  const response = await fetch(
    `https://murmuring-island-07996.herokuapp.com/api/replays?${searchParams.toString()}`,
    {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "no-cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log(response);
  return response.json(); // parses JSON response into native JavaScript objects
};
