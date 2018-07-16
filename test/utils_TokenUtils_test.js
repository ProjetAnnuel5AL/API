var request = require('supertest');
var app = require('../index.js');
var models = require('../models');
var utils = require("../utils");
var TokenUtils = utils.TokenUtils;
var assert = require('chai').assert


/*describe('test TokenUtils', function(){ 

    //Insert user all type in base
    beforeEach(function() {
        var User = models.User;
        User.create({
            "idUser" : 1,
            "loginUser" : "iPlowPlow",
            "emailUser" : "testMail@gmail.com",
            "passwordUser" : "test",
            "saltUser" : "aaaa",
            "mailValidationUser" : false,
            "validationCodeUser" : "aaa",
            "typeUser" : 3
        });
        User.create({
            "idUser" : 2,
            "loginUser" : "iPlowPlow2",
            "emailUser" : "testMail@gmail.com",
            "passwordUser" : "test",
            "saltUser" : "aaaa",
            "mailValidationUser" : false,
            "validationCodeUser" : "aaa",
            "typeUser" : 2
        });
        User.create({
            "idUser" : 3,
            "loginUser" : "iPlowPlow3",
            "emailUser" : "testMail@gmail.com",
            "passwordUser" : "test",
            "saltUser" : "aaaa",
            "mailValidationUser" : false,
            "validationCodeUser" : "aaa",
            "typeUser" : 1
        });
    });


    describe('check method findIdUser' , function() {
        it('When iPlowPlow must be 1', function() {
            assert.equal(1, 1);
        })

        it('When bloubou must be null', function() {
            assert.equal(1, null);
        })

    })


    //DELETE ALL INSERT
    afterEach(function(){

    })

})*/