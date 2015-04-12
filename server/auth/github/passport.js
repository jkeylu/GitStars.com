var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var _ = require('lodash');

exports.setup = function(User, config) {
  passport.use(new GitHubStrategy({
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'id': profile.id
      }, function(err, user) {
        if (!user) {
          var keys = [ 'login', 'id', 'avatar_url', 'type', 'site_admin',
            'name', 'company', 'blog', 'location', 'email', 'hireable',
            'bio', 'public_repos', 'public_gists', 'followers', 'following',
            'created_at', 'updated_at' ];
          var obj = _.pick(profile._json, keys);
          obj.access_token = accessToken;
          obj.created_at = new Date(obj.created_at);
          obj.updated_at = new Date(obj.updated_at);
          obj.gs_created_at = new Date();
          obj.gs_logined_at = new Date();
          user = new User(obj);
          user.save(function(err) {
            if (err) done(err);
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    })
  );
};
