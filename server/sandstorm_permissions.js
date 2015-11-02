var davReadMethods = {
  'GET': true,
  'HEAD': true,
  'OPTIONS': true,
  'PROPFIND': true,
  'REPORT': true
};

var webReadMethods = {
  'GET': true,
  'HEAD': true,
  'OPTIONS': true
}

var validate = {
  edit: function validateEdit(req) {
    return true;
  },

  view: function validateView(req) {
    return webReadMethods[req.method];
  },

  sync: function validateSync(req) {
    return davReadMethods[req.method];
  }
};

module.exports = function(req, res, next) {
  var permissions = req.headers['x-sandstorm-permissions'];

  if(permissions) {
    permissions = permissions.split(',');

    for(var i = 0; i < permissions.length; i++) {
      var permission = permissions[i];
      console.log(permission);
      console.log(validate[permissions]);

      if(validate[permission] && validate[permission](req)) {
        return next();
      }
    }
    res.writeHead(403, {});
    res.end("Access denied.");
  } else {
    next();
  }
};
