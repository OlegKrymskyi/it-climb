'use strict';
const express = require('express'),
      router = express.Router(),
      log = require('../../../lib/log'),
      RegistrationService = require('./service'),
      validator = require('email-validator'),
      UserService = require('./../user/service'),
      StakeholderService = require('../stakeholder/service');


router.post('/reg', (req, res) => {

    if(req.body.name === "" || req.body.email === "" || req.body.phone === "" || req.body.aboutUs === "") {
        log.info("Registration ERROR");
        res.sendStatus(400);
    }

    if(req.body.name !== "" && req.body.email !== "" && req.body.phone !== "" && req.body.aboutUs !== ""){

        if(!(validator.validate(req.body.email))){

            res.sendStatus(417);
        } else {

            let name = req.body.name;
            let email = req.body.email;
            let phone = req.body.phone;
            let aboutUs = req.body.aboutUs;
            UserService.createUser(name, email, phone, aboutUs).then(()=>{
                StakeholderService.getStakeholdersFromContentful(req, res, 'stakeholder', (stakeholders) =>{

                    let subject1 = 'New Registration';
                    let message1 = '<p>email: <b>' + email + '</b></p><br/>' +
                        '<p>name: <b>' + name + '</b></p><br/>' +
                        '<p>phone: <b>' + phone + '</b></p><br/>' +
                        '<p>aboutUs: <b>' + aboutUs + '</b></p><br/>';

                    for (let email of stakeholders) {
                        RegistrationService.sendler(email, subject1, message1);
                    }
                    res.sendStatus(200)
                });
            });
        }
    }
});

// router.post('/test', (req, res, next) => {
//
// });

module.exports = router;