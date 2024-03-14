import makeApiCall from "./makeApiCall";

export const sortImages = async (sort, id, amount) => {
  const request = JSON.stringify({
    sort_type: sort,
    competition_type: id,
    amount: amount,
  });

  let res = await makeApiCall(
    `https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/sort_drawings`,
    "POST",
    request
  );

  return res;
};
