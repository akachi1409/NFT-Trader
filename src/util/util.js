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

const getDataForContract = async (contract, date, action) => {
  console.log("contract:", contract);
  const startDateTimestamp = date.getTime() + 2 * 24 * 60 * 60 * 1000;
  const startDate = new Date(startDateTimestamp);
  const config = {
    headers: {
      "x-api-key": "d218315d31bb4d0bb4308c2cd45938a2",
    },
  };
  const config1 = {
    headers: {
      "x-api-key": "852d96d562f646fd88184540dbd4f434",
    },
  };
  const params =
    "asset_contract_address=" +
    contract +
    "&event_type=successful&occurred_after=" +
    getFormattedDate(date) +
    "&occurred_before=" +
    getFormattedDate(startDate) +
    "&only_opensea=true"; //+ "&occurred_before="+ getFormattedDate(date);
  var url = "https://api.opensea.io/api/v1/events?" + params;
  var data = [];
  var next = "";
  await axios.get(url, config).then((res) => {
    if (res.status === 400 || res.status === 500) return res.data;
    // console.log(res.data.asset_events);
    next = res.data.next;
    // console.log("Config :", res.data.asset_events.length);
    for (var i = 0; i < res.data.asset_events.length; i++) {
      if ( action == "1"){
        data.push(res.data.asset_events[i].winner_account.address);
      }else{
        data.push(res.data.asset_events[i].transaction.from_account.address);
      }
    }
    // console.log(data, next);
  });
  // await delay(30000);
  var sequence = 1;
  while (next != null) {
    var param1 =
      "asset_contract_address=" +
      contract +
      "&event_type=successful&cursor=" +
      next +
      "&event_type=successful&occurred_after=" +
      getFormattedDate(date) +
      "&occurred_before=" +
      getFormattedDate(startDate);
    var url1 = "https://api.opensea.io/api/v1/events?" + param1;
    try {
      if (sequence % 2 === 1) {
        await axios.get(url1, config1).then((res) => {
          if (res.status === 400 || res.status === 500) return res.data;
          // console.log(res);
          next = res.data.next;
          // console.log("Config 1:", res.data.asset_events.length);
          for (var i = 0; i < res.data.asset_events.length; i++) {
            console.log(res.data.asset_events[i].created_date < date);
            if ( action == "1"){
              data.push(res.data.asset_events[i].winner_account.address);
            }else{
              data.push(res.data.asset_events[i].transaction.from_account.address);
            }
          }
          // console.log(data, next);
        });
      } else {
        await axios.get(url1, config).then((res) => {
          if (res.status === 400 || res.status === 500) return res.data;
          // console.log(res);
          next = res.data.next;
          // console.log("Config:", res.data.asset_events.length);
          for (var i = 0; i < res.data.asset_events.length; i++) {
            if ( action == "1"){
              data.push(res.data.asset_events[i].winner_account.address);
            }else{
              data.push(res.data.asset_events[i].transaction.from_account.address);
            }
          }
          // console.log(data, next);
        });
      }
    } catch (err) {
      console.log("err:", err);
      await delay(1000);
    }

    sequence++;
    // await delay(20000);
  }

  return data;
};

export { getDataForContract };
