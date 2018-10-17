stopedVideo = (count) => {
    $('#vid' + count).addClass("youtube-iframe" + count);
    $('.youtube-iframe' + count).each(function() {
        $(this).attr('src', $(this).attr('src'));
        return false;
    });
};

// pattern="[A-Za-z\s]{6,30}"
// title="Please enter at least 6 characters only English letters. You can use space. For Example: 'Ivan Ivanov'"

// pattern="[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)"
// title="Please enter correct Email address. For example: email@example.com"

$().ready(function() {

    $.validator.addMethod("regxName", function(value, element, regexpr) {
        console.log("Name: " + value + " (" + regexpr.test(value) + ")");
        return regexpr.test(value);
    }, "Please enter correct Name. For Example: 'Ivan Ivanov'");

    $.validator.addMethod("regxEmail", function(value, element, regexpr) {
        console.log("Email: " + value + " (" + regexpr.test(value) + ")");
        return regexpr.test(value);
    }, "Please enter correct email address.");

    $.validator.addMethod("regxPhone", function(value, element, regexpr) {
        console.log("Phone: " + value + " (" + regexpr.test(value) + ")");
        return regexpr.test(value);
    }, "Please enter correct phone number.");

    $.validator.addMethod("check", function(value, element, arg){
        return arg !== value;
    }, "Please select something!");

    $("#regForm").validate({

            rules: {
                name: {
                    required: true,
                    regxName: /^[a-zA-Zа-яА-Я\s]*$/,
                    minlength: 6,
                    maxlength: 60,
                },
                email: {
                    required: true,
                    regxEmail: /([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/
                },
                phone: {
                    required: true,
                    regxPhone: /\+[0-9]{2}\s\([0-9]{3}\)\s[0-9]{3}\-[0-9]{2}\-[0-9]{2}/
                },
                aboutUs: {
                    required: true,
                    check: ""
                }
            },
            messages: {
                name: {
                    required: "Please enter at least 6 characters.",
                },
                email: {
                    required: "Please enter correct Email address.",
                },
                phone: {
                    required: "Please enter correct phone number",
                },
                aboutUs: {
                    required: "Please select something.",
                }
            }
        });
    });