_.mixin(_.extend(require('underscore.string').exports(), require(path.join(_rootPath, 'libs', 'common'))))
var request = require('request')
_moment.locale("vi")
fsx.readdirSync(path.join(_rootPath, 'modals')).forEach(function (file) {
    if (path.extname(file) !== '.js') return
    global['_' + _.classify(_.replaceAll(file.toLowerCase(), '.js', ''))] = require(path.join(_rootPath, 'modals', file))
    console.info('Modal : '.yellow + '_' + _.classify(_.replaceAll(file.toLowerCase(), '.js', '')))
})
global.hostname = 'http://' + _.chain(require('os').networkInterfaces()).values().flatten().filter(function (val) {
    return (val.family == 'IPv4' && val.internal == false)
}).pluck('address').first().value() + ':' + _config.app.port;
module.exports = function routers(app) {
    app.locals._moment = _moment;
    app.locals._switch = _.switch;
    app.locals._equal = _.isEqual;
    app.locals._breadCrumbs = _.breadCrumbs;
    fsx.readdirSync(path.join(_rootPath, 'controllers')).forEach(function (file) {
        if (path.extname(file) !== '.js') return
        app.resource(_.trim(_.dasherize(_.replaceAll(file.toLowerCase(), '.js', ''))).toString(), require(path.join(_rootPath, 'controllers', file.toString())))
    })
    app.post('/login', function (req, res) {
        var _body = _.pick(req.body, 'name', 'email', 'password', 'deviceId');
        if (!((_.has(_body, 'name') || _.has(_body, 'email')) && _.has(_body, 'password'))) return res.status(200).send({
            code: 406,
            message: 'Một số trường bắt buộc'
        });

        mongoClient.collection('users').findOne({ $and: [{ $or: [{ name: _body.name }, { email: _body.name }] }, { password: _body.password }] }, function (error, user) {
            if (_.isNull(user) || _.isUndefined(user))
                return req.xhr ? res.status(200).send({ code: 404, message: 'Sai tên đăng nhập hoặc mật khẩu' }) : res.redirect('/');//mrC
            if (_.isEqual(user.status, 0)) {
                return res.status(200).send({ code: 406, message: 'Tài khoản đã bị khoá' });
            }
            req.session['logged'] = true;
            console.log("success login ma")
            var dataResponse = {
                code: 200,
                agentId: user.idAgentCisco,
                extension: user.accountCode,
                isLoginMobile: user.isLoginMobile,
                extensionMobile: user.extensionMobile,
                dialNumber: user.dialNumber,

            }
            console.log("req.xhr",req.xhr);
            req.xhr ? res.status(200).send(dataResponse) : res.redirect('/');
        });
    });

    app.get('/logout', function (req, res) {
        var agentId = req.session.user ? req.session.user._id : null;
        console.log("req",req);
        console.log("_socketUsers",_socketUsers);
        if (req.session.user && _socketUsers[agentId] && _.isEqual(_socketUsers[agentId].sessionID, req.sessionID)) {
            var monitor = _socketUsers[agentId] ? _socketUsers[agentId].monitor : null;
            if (monitor) monitor.destroy();
            delete _socketUsers[agentId];

            _.each(sio.sockets.sockets, function (s, k) {
                s.emit("agentOffline", agentId);
            });
        }

        req.session.user = null;
        req.session.auth = null;
        req.session.logged = false;
        res.redirect('/');
    });
}