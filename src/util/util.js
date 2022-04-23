import axios from "axios";

const getDataForContract = (contract) => {
  const config = {
    headers: {
      "x-api-key": "d218315d31bb4d0bb4308c2cd45938a2",
    },
  };
  const params = "asset_contract_address=" + contract + "&event_type=successful";
  var url = "https://api.opensea.io/api/v1/events?" + params;
  return axios
    .get(url, config)
    .then((res) => {
      if (res.status === 400 || res.status === 500) throw res.data;
      return res.data;
    })
    .catch((err) => {
      throw err[1];
    });
};

export { getDataForContract}
