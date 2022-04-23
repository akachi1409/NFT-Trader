import axios from "axios";
import delay from "delay";
function getFormattedDate(date) {
  var str =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();

  return str;
}

const getDataForContract = async (contract, date) => {
  const config = {
    headers: {
      "x-api-key": "d218315d31bb4d0bb4308c2cd45938a2",
    },
  };
  const params =
    "asset_contract_address=" +
    contract +
    "&event_type=successful&occurred_after=" +
    getFormattedDate(date) +
    "&only_opensea=true"; //+ "&occurred_before="+ getFormattedDate(date);
  var url = "https://api.opensea.io/api/v1/events?" + params;
  var data = [];
  var next = "";
  await axios.get(url, config).then((res) => {
    if (res.status === 400 || res.status === 500) return res.data;
    console.log(res.data.asset_events);
    next = res.data.next;
    // data += res.data.asset_events;
    console.log("length:", res.data.asset_events.length);
    for (var i = 0; i < res.data.asset_events.length; i++) {
      data.push(res.data.asset_events[i].winner_account.address);
    }
    console.log(data, next);
  });
  await delay(10000 * Math.random());
  while (next != "") {
    var param1 = "&event_type=successful&cursor=" + next;
    var url1 = "https://api.opensea.io/api/v1/events?" + param1;
    await axios.get(url1, config).then((res) => {
      if (res.status === 400 || res.status === 500) return res.data;
      console.log(res.data.asset_events);
      next = res.data.next;
      // data += res.data.asset_events;
      console.log("length:", res.data.asset_events.length);
      for (var i = 0; i < res.data.asset_events.length; i++) {
        // console.log("--", i, res.data.asset_events[i]);
        data.push(res.data.asset_events[i].winner_account.address);
      }
      console.log(data, next);
    });
    await delay(20000 * Math.random());
  }

  return data;
  // return axios
  //   .get(url, config)
  //   .then((res) => {
  //     if (res.status === 400 || res.status === 500) throw res.data;
  //     console.log("res", res);
  //     if ( res.data.next !=""){
  //       var url1 =  "https://api.opensea.io/api/v1/events?asset_contract_address="+ contract+ "&cursor="+res.data.next
  //       axios.get(url1, config).then((res1)=>{console.log("res1", res1);})
  //     }
  //     // return res.data;
  //   })
  //   .catch((err) => {
  //     throw err[1];
  //   });
};

const getDataForContractUsingAlchemy = (contract) => {
  var data = JSON.stringify({
    jsonrpc: "2.0",
    id: 0,
    method: "alchemy_getAssetTransfers",
    params: [
      {
        fromBlock: "0xA97AB8",
        toBlock: "0xA97CAC",
        fromAddress: "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE",
        contractAddresses: ["0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9"],
        maxCount: "0x5",
        excludeZeroValue: true,
        category: ["external", "token"],
      },
    ],
  });
};
export { getDataForContract };
