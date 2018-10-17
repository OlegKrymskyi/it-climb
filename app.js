const express = require('express'),
      http = require('http'),
      favicon = require('serve-favicon'),
      bodyParser = require('body-parser'),
      sheduler = require('node-schedule'),
      cron = require('cron'),
      mongoose = require('mongoose'),

      User = require('./src/models/user/model'),
      UserService = require('./src/models/user/service'),

      config = require('./config/config'),
      pageRoutes = require("./src/page-routes"),
      restRoutes = require("./src/rest-routes"),
      AboutUsService = require('./src/models/aboutUs/service'),
      RegistrationService = require('./src/models/registration/service'),
      ReviewService = require('./src/models/review/service'),
      log = require('./lib/log'),
      errorHandler = require('express-error-handler'),
      path = require('path');

const app = express();

mongoose.Promise = global.Promise;
mongoose.set('debug', true);
mongoose.connect("mongodb://127.0.0.1:27017/TestITClimb", (err)=>{
    if(err){
        log.info("ERROR connect to DB")
    } else {
        log.info("Connect to DB")
    }
});

let aboutUs = [];

AboutUsService.getAboutUsFromContentful('aboutUs', (aboutUs) => {
    this.aboutUs = aboutUs
});

let reviews = [];

ReviewService.getReviewFromContentfull('review', (preReviews) =>
    ReviewService.getAssetsfromContentful(preReviews, (avatars) => {
           log.info(avatars);
            this.reviews = avatars;
    })
);

let text = '';

RegistrationService.getTextFromContentfull('emailText', (texts) =>{
    for(let i = 0; i<texts.length; i++){
        if(texts[i].name === 'regEmail'){
            text = texts[i].text;
        }
    }
});

app.set('port', config.port);

http.createServer(app).listen(app.get('port'), () => {
    log.info('Express server listening on port ' + app.get('port'));
});

app.set('views', __dirname + '/assets/templates');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/assets/public/'));
app.use(favicon(path.join(__dirname, '/assets/public/img', 'favicon.ico')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
        res.render("index", {
            aboutUs: this.aboutUs,
            reviews: this.reviews
        });
    log.info(reviews);
    });


app.post('/api/update', (req, res, next) => {
    AboutUsService.getAboutUsFromContentful('aboutUs', (aboutUs) => {
        this.aboutUs = aboutUs;
    });

    ReviewService.getReviewFromContentfull('review', (preReviews) =>
        ReviewService.getAssetsfromContentful(preReviews, (avatars) =>{
                this.reviews = avatars;
                res.redirect('/');
            }
        )
    );

    RegistrationService.getTextFromContentfull('emailText', (texts) =>{
        console.info(`emailText before change: ${text}`);
        for(let i = 0; i<texts.length; i++){
            if(texts[i].name === 'regEmail'){
                text = texts[i].text;
                console.info(`emailText before change: ${text}`);
            }
        }
    });
});


app.use(pageRoutes);

app.use(restRoutes);

let rule = new sheduler.RecurrenceRule();
rule.minute = [0,5,10,15,20,25,30,35,40,45,50,55];

sheduler.scheduleJob(rule, ()=>{

    console.info(`Text for Email Registration: ${text}`);
    User.find((err, users)=>{
        users.forEach((user)=>{
            if(err){
                log.info(err)
            }
            if(!user.sendEmail){
                UserService.sendEmailUser(user, text);
            } else {
                log.info(user.name + " - send Mail true");
            }
            if(!user.contentful){
                UserService.saveUserInContentful(user)
            } else {
                log.info(user.name + " - contentful true");
            }
        })
    });
});

// RegistrationService.sendler(email, subject, message);
// RegistrationService.saveInContentful(name, email, phone, aboutUs);







// app.use((err, req, res, next) => {
//     // NODE_ENV = 'production'
//     if (app.get('env') === 'development') {
//         app.use(errorHandler());
//     } else {
//         res.send(500);
//     }
// });
