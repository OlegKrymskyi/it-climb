'use strict';

const nodemailer = require('nodemailer'),
      // client = require('../../until/contentfulClient'),
      log = require('../../../lib/log'),
      contentful = require('contentful-management'),
      User = require('./../user/model'),

    config = require('../../../config/config');


const RegistrationService = {

    sendler: (email, subject, message) => {

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
            to: email,
            subject: subject,
            html: message
        };

        transporter.sendMail(HelperOptions, (error, info) => {
            if(error){
                return log.info('Error: ' + error);
            }
            log.info("The message was sent on " + email);
            log.info(info);

        });
    },

    saveInContentful: (name, email, phone, aboutUs)  => {

        let space_id = config.contentful.spaceId1;
        let contentType_id = 'registrations';

        const client = contentful.createClient({
            accessToken: config.contentful.personalKey
        });

        client.getSpace(space_id).then((space) => space.createEntry(contentType_id, {
            fields: {
                name: {
                    'en-US': name
                },
                email: {
                    'en-US': email
                },
                phone: {
                    'en-US': phone
                },
                aboutUs: {
                    'en-US': aboutUs
                }
            }
        }))
            .then((entry) => {
                log.info('Contacts Saved in Contentful');
                log.info(entry);
            })
            .catch(log.error);
    },

    getTextFromContentfull: (contentType, next) => {

        let space_id = config.contentful.spaceId2;
        let contentType_id = contentType;

        let texts = [];

        const client = contentful.createClient({
            accessToken: config.contentful.personalKey
        });

        client.getSpace(space_id)
            .then((space) => space.getEntries({
                    content_type: contentType_id,
                }).then((response) => {

                    log.info(response.items);

                    texts = [];

                    for (let item of response.items) {

                        texts.push({
                            name: item.fields.title['en-US'],
                            text: item.fields.text['en-US'],
                        });
                    }
                    next(texts);
                })
                    .catch(err => {
                            log.info(err);
                            // next();
                        }
                    )
            )
    }
};

module.exports = RegistrationService;