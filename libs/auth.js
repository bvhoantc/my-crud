exports.auth = function (req, res, next) {
    var _skip = (['assets', 'favicon'].indexOf(req.path.split('/')[1]) >= 0)
        || (_.isEqual(req.path, '/login'))
        || (_.has(req.session, 'logged')
        && (_.isEqual(req.session.logged, true))
        && _.isEqual(req.path, '/auth'));
    if (_skip) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        return next();
    }
    if (['html'].indexOf(req.path.split('/')[1]) >= 0) return _.render(req, res, 'login', {page: req.path.split('/')[2], demo: true}, true);
    if(req.session.user && req.session.logged){
        var agentId = req.session.user._id;
    }
    console.log('status', req.session.logged);
    if (!req.session.logged) return _.render(req, res, 'login', {title: 'Đăng nhập'}, true);
    next();
};