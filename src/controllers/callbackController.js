async function handleDeliveryStatus(req, res) {
    const messageSid = req.body.MessageSid;
    const messageStatus = req.body.MessageStatus;
    const messageErrorCode = req.body.ErrorCode;
    const messageErrorMessage = req.body.ErrorMessage;
    
    res.sendStatus(200);
  }
  
  module.exports = { handleDeliveryStatus };
  