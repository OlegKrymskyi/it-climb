'use strict';

const log = require('./../../../lib/log'),
      User = require('./model'),
      config = require('./../../../config/config'),
      contentful = require('contentful-management'),
      nodemailer = require('nodemailer');

const UserService = {

createUser: (name, email, phone, aboutUs)=>{

    return new Promise((resolve,reject)=>{

        let newUser = new User({
            name: name,
            email: email,
            phone: phone,
            aboutUs: aboutUs,
        });

        newUser.save((err) => {
            if(err){
                log.info("ERROR createUser: " + err);
                reject(err)
            } else {
                log.info("User: " + newUser.name + "add in db");
                resolve();
            }
        })
    })
},

    sendEmailUser: (user, text) => {

        let transporter = nodemailer.createTransport({

            service: 'gmail',
            secure: false,
            port: 25,
            auth: {
                user: 'it.climb.course@gmail.com',
                pass: 'qwe123QWE123'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let HelperOptions = {
            from: 'it.climb.course@gmail.com',
            to: user.email,
            subject: "Thank you for Registration",
            html: text ||'<p>Thank you for registration</p><br/>' +
                         '<p>We will contact you</p>'
        };

        transporter.sendMail(HelperOptions, (error, info) => {
            if(error){
                return log.info('Error: ' + error);
            }
            log.info("The message was sent on " + user.email);
            log.info(info);

            user.update({sendEmail: true}, (err)=>{
                if(err){
                    log.info("ERROR sendEmailUser: " + err);
                }
            })

        });
    },
    saveUserInContentful: (user)  => {

        let space_id = config.contentful.spaceId1;
        let contentType_id = 'registrations';

        const client = contentful.createClient({
            accessToken: config.contentful.personalKey
        });

        client.getSpace(space_id).then((space) => space.createEntry(contentType_id, {
            fields: {
                name: {
                    'en-US': user.name
                },
                email: {
                    'en-US': user.email
                },
                phone: {
                    'en-US': user.phone
                },
                aboutUs: {
                    'en-US': user.aboutUs
                }
            }
        }))
            .then((entry) => {

            user.update({contentful: true}, (err)=>{
               if(err){
                   log.info('ERROR saveUserInContentful: ' + err);
               }
            });
                log.info('Contacts Saved in Contentful');
                log.info(entry);
            })
            .catch(log.error);
    }
};

module.exports = UserService;