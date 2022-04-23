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
  const config1 = {
    headers:{
      "x-api-key": "852d96d562f646fd88184540dbd4f434"
    }
  }
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
    console.log("Config :", res.data.asset_events.length);
    for (var i = 0; i < res.data.asset_events.length; i++) {
      data.push(res.data.asset_events[i].winner_account.address);
    }
    console.log(data, next);
  });
  await delay(30000 );
  var sequence = 1;
  while (next != "") {
    var param1 = "&event_type=successful&cursor=" + next;
    var url1 = "https://api.opensea.io/api/v1/events?" + param1;
    if (sequence%2 == 1){
      await axios.get(url1, config1).then((res) => {
        if (res.status === 400 || res.status === 500) return res.data;
        console.log(res.data.asset_events);
        next = res.data.next;
        // data += res.data.asset_events;
        console.log("Config 1:", res.data.asset_events.length);
        for (var i = 0; i < res.data.asset_events.length; i++) {
          // console.log("--", i, res.data.asset_events[i]);
          data.push(res.data.asset_events[i].winner_account.address);
        }
        console.log(data, next);
      });
    }
    else{
      await axios.get(url1, config).then((res) => {
        if (res.status === 400 || res.status === 500) return res.data;
        console.log(res.data.asset_events);
        next = res.data.next;
        // data += res.data.asset_events;
        console.log("Config:", res.data.asset_events.length);
        for (var i = 0; i < res.data.asset_events.length; i++) {
          // console.log("--", i, res.data.asset_events[i]);
          data.push(res.data.asset_events[i].winner_account.address);
        }
        console.log(data, next);
      });
    }
    sequence ++;
    await delay(30000 );
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

export { getDataForContract };
