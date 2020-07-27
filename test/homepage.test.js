// const request = require('supertest');
// const index = require('../index');

// describe("first test", function(){
//     it("welcomes the user", function(done){
//         request(index).get('/patients/test')
//             //.send()
//             .expect(200)
//             .expect('{"message":"test succesfull"}', done)
//     })
// })
let mongoose = require("mongoose");
//let Book = require('../app/models/book');
process.env.NODE_ENV = 'test';
const chai = require("chai");
const server = require("../index");
const chaiHttp = require("chai-http");

//Assertion style
chai.should();
chai.use(chaiHttp);
describe('Test API', () =>{
    // beforeEach((done) => { //Before each test we empty the database
    //     Book.remove({}, (err) => { 
    //        done();           
    //     });        
    // });
    
    describe("POST /doctors/register", ()=>{
        it("get 200 json and a message", (done)=>{
            const doc = {
                "name": "ashish",
                "email": "ashish99@gmail.com",
                "password": "nj1234",
                "confirm_password": "nj1234"
            }
            chai.request(server)
                .post("/doctors/register")
                .send(doc)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message').eq("doctor succesfully registered");
                done();
                })
        })
    })
    describe("GET /patients/test", ()=>{
        it("get 200 json and a message", (done)=>{
            chai.request(server)
                .get("/patients/test")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message').eq("test succesfull");
                done();
                })
        })
    })

})