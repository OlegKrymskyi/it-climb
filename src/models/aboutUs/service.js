'use strict';

const nodemailer = require('nodemailer'),
      contentful = require('contentful-management'),
      log = require('../../../lib/log'),
      config = require('../../../config/config');


const StakeholderService = {

    getAboutUsFromContentful: (contentType, next) => {

        let space_id = config.contentful.spaceId2;
        let contentType_id = contentType;

        let aboutUs = [];

        const client = contentful.createClient({
            accessToken: config.contentful.personalKey
        });

        client.getSpace(space_id)
            .then((space) => space.getEntries({
                content_type: contentType_id
            }))
            .then((response) => {

                log.info(response.items);

                for (let item of response.items) {
                    aboutUs.push(
                        {
                            name: item.fields.name['en-US']
                        }
                    );
                }
                next(aboutUs);
            })

            .catch(log.error);
    }
};
module.exports = StakeholderService;