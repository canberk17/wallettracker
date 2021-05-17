require('dotenv').config()
const ethapi = require('etherscan-api').init(process.env.ETHAPI)



    async function getTransactionFromAddress(Address) {
        let tx = await ethapi.account.txlist(Address, 1, 'latest', 1,10, 'asc')
    
        return tx
    }

let walletaddress='0x88a7EF2F047F8b07c6C917a6FD1A13438E9d8424' //any address

    async function getTime(unix){
      var date = new Date(unix * 1000);
      // Hours part from the timestamp
      var hours = date.getHours();
      // Minutes part from the timestamp
      var minutes = "0" + date.getMinutes();
      // Seconds part from the timestamp
      var seconds = "0" + date.getSeconds();

      // Will display time in 10:30:23 format
      var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    }
let txMonitor
let monitoringtx = false

async function monitortx() {
  if(monitoringtx) {
    return
  }

  console.log("Checking transactions...")
  monitoringtx = true

  try {
   
   
   
    getTransactionFromAddress(walletaddress).then((res) => {
        
        
        console.table([{
            "Time": parseInt(res.result[0].timeStamp)*1000,
            "From": res.result[0].from,
            "To": res.result[0].to,
            "Gas": res.result[0].gasPrice,
            "Value:" : res.result[0].value
          }]);

    })
  } catch (error) {
    console.error(error)
    monitoringtx = false
    clearInterval(pricetx)
    return
  }

  monitoringtx = false
}

// Check markets every n seconds
const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 3000 // 3 Seconds
priceMonitor = setInterval(async () => { await monitortx() }, POLLING_INTERVAL)
