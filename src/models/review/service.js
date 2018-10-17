'use strict';
const
    _ = require('lodash'),
    contentful = require('contentful-management'),
    log = require('./../../../lib/log'),
    config = require('./../../../config/config');

const ReviewService = {

    getReviewFromContentfull: (contentType, next) => {

        let space_id = config.contentful.spaceId2;
        let contentType_id = contentType;

        let preReviews = [];

        const client = contentful.createClient({
            accessToken: config.contentful.personalKey
        });

        client.getSpace(space_id)
            .then((space) => space.getEntries({
                    content_type: contentType_id,
                }).then((response) => {

                    log.info(response.items);

                preReviews = [];

                    for (let item of response.items) {

                        preReviews.push({
                                name: item.fields.name['en-US'],
                                review: item.fields.review['en-US'],
                                review2: item.fields.review2['en-US'],
                                avatarID: item.fields.avatar['en-US'].sys.id,
                                video: item.fields.video['en-US']
                            });
                    }
                    next(preReviews);
                })
                .catch(err => {
                        log.info(err);
                        // next();
                        }
                    )
            )
    },

    getAssetsfromContentful(preReviews, next){

        let space_id = config.contentful.spaceId2;

        let avatars = [];(module)

        const client = contentful.createClient({
            accessToken: config.contentful.personalKey
        });

        preReviews.forEach((item, index, array) => {
            client.getSpace(space_id)
                .then((space) => space.getAsset(item.avatarID))
                .then((asset) => {
                    avatars.push({
                        index: index || "" ,
                        name: item.name || "",
                        review: item.review || "",
                        review2: item.review2 || "",
                        avatar: asset.fields.file['en-US'].url || "",
                        video: item.video || ""
                    });
                });
        });


        const func = () => {
            next(avatars)
        };

        setTimeout( func, 5000);

    // },
    // getVideofromContentful(avatars, next){
    //
    //     let space_id = config.contentful.spaceId2;
    //
    //     let reviews = [];
    //
    //     const client = contentful.createClient({
    //         accessToken: config.contentful.personalKey
    //     });
    //
    //     avatars.forEach((item, index, array)=>{
    //         client.getSpace(space_id)
    //             .then((space) => space.getAsset(item.video))
    //             .then((asset) => {
    //                 reviews.push({
    //                     index: index,
    //                     name: item.name,
    //                     review: item.review,
    //                     review2: item.review2,
    //                     avatar: item.avatar,
    //                     video: asset.fields.file['en-US'].url
    //                 });
    //             });
    //     });
    //
    //     const func = () => {
    //         next(reviews)
    //     };
    //     setTimeout(func, 5000);
    }
};

module.exports = ReviewService;