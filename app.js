const   
        express                 = require('express'),
        mongoose                = require('mongoose'),
        passport                = require('passport'),
        bodyParser              = require('body-parser'),
        LocalStrategy           = require('passport-local'),
        passportLocalMongoose   = require('passport-local-mongoose')
        path                    = require('path');
        User                    = require('./models/user')

mongoose.connect('mongodb+srv://gurraoptimus:Mormor6133@cluster0-oe8hv.mongodb.net/my_app?retryWrites=true&w=majority', 
    {   useNewUrlParser: true,
        useUnifiedTopology: true

});

const app = express();

app.use(require('express-session')({
    secret:'Jag älskar donken',
    resave: false,
    saveUninitialized: false
}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views/'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});


//==================================
// ROUTES
//==================================

app.get('/contact', (req, res) => {
    res.render('contact')
 });
 

app.get('/', (req, res) => {
   res.render('moonlightsstore')
});

app.get('/index', (req, res) => {
   res.render('index')
});

app.get('/home', isLoggedIn, (req, res) => {
    res.render('home')
});

app.get('/store', (req, res) => {
    res.render('home/store')
});

app.get('/admin',isLoggedIn,(req, res) => {
    res.render('home/admin')
});

app.get('/moderator',isLoggedIn,(req, res) => {
    res.render('home/moderator')
});
// Auth Routes

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/lost-account', (req, res) => {
    res.render('Lost-account')
});
//hanterar användar registrering
app.post('/register', (req, res) => {
    req.body.username
    req.body.password
    const newUser = new User({username: req.body.username});
    if(req.body.adminCode === "moonlight") {
        newUser.isAdmin = true;
        newUser.isMod = true;
    }
    if(req.body.modCode === "modcode"){
        newUser.isMod = true;
    }
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render('register', {error: err.message});
        } 
        passport.authenticate('local')(req, res, () => {
            res.redirect('/home')
        });
    });
});

// LOGIN ROUTES
// render login form
/** 
app.get('/login', (req, res) => {
    res.render('login')
})*/

//login logic
// middleware
app.post('/', passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/#'
    }), (req, res) => {
});

app.get('/logout', (req, res) =>{
    req.logOut();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

app.listen(3000, () => console.log(`myApp app listening on port ${3000}!`))
