define([
    'hr/hr'
], function(hr) {
    var rpc = new hr.Backend({
        prefix: "rpc"
    });

    rpc.defaultMethod({
        execute: function(args, options, method) {
            options = _.defaults({}, options || {}, {
                dataType: "json",
                options: {
                    'headers': {
                        'Content-type': 'application/json'
                    }
                }
            });

            return hr.Requests.post("rpc/"+method, JSON.stringify(args), options).then(function(data) {
                if (!data.ok) return Q.reject(new Error(data.error));
                return Q(data.data);
            }, function(err) {
                try {
                    var errContent = JSON.parse(err.httpRes);
                    return Q.reject(new Error(errContent.error || err.message));
                } catch(e) {
                    return Q.reject(err);
                }
            });
        }
    });

    // Cached methods
    rpc.addCachedMethod('box/status');
    rpc.addCachedMethod('auth/join');
    rpc.addCachedMethod('addons/list');
    rpc.addCachedMethod('users/list');
    
    return rpc;
});