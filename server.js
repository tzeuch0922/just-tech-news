const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers.js');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const hbs = exphbs.create({ helpers });

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = 
{
    secret: 'Super secret secret',
    cookies: {},
    resave: false,
    saveUnitialized: true,
    store: new SequelizeStore(
    {
        db: sequelize
    })
}


const app = express();
const PORT = process.env.PORT || 3001;

app.use(session(sess));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false })
.then(() =>
{
    app.listen(PORT, () => 
    {
        console.log('Now listening');
    });
});