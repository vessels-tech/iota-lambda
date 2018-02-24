

const validIOTARequest = (req) => {
  if (!req.body) {
    return false;
  }

  if (!req.body.command) {
    //TODO actually check for a proper command
    return false;
  }

  return true;
}


module.exports = {
  validIOTARequest,
}
