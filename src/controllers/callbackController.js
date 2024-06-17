async function handleDeliveryStatus(req, res) {
    const messageSid = req.body.MessageSid;
    const messageStatus = req.body.MessageStatus;
    const messageErrorCode = req.body.ErrorCode;
    const messageErrorMessage = req.body.ErrorMessage;
  
    console.log(`Message SID: ${messageSid}, Status: ${messageStatus}, Error Code: ${messageErrorCode}, Error Message: ${messageErrorMessage}`);
  
    res.sendStatus(200);
  }
  
  module.exports = { handleDeliveryStatus };
  