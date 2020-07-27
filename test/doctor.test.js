
let mongoose = require("mongoose");
const Doctor = require('../models/doctor');
process.env.NODE_ENV = 'test';
const chai = require("chai");
const server = require("../index");
const chaiHttp = require("chai-http");

//Assertion style
chai.should();
chai.use(chaiHttp);
before((done) => { //Before each test we empty the database
    //console.log("times run");
    Doctor.remove({}, (err) => { 
       done();           
    });        
});
describe('Test API', () =>{
    
    let token ="";
    describe("POST /doctors/register", ()=>{
        const doc = {
            "name": "ashish",
            "email": "ashish99@gmail.com",
            "password": "nj1234",
            "confirm_password": "nj1234"
        }
        it("doctor regirstered succesfully => status 200 with message", (done)=>{
            
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
        it("doctor already registered => status 404 with messsage", (done)=>{
            chai.request(server)
                .post("/doctors/register")
                .send(doc)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message').eq("doctor already registered");
                done();
                })
        })
    })
    describe("POST /doctors/login", ()=>{
        const presentDoc = { 
            "email": "ashish99@gmail.com",
            "password": "nj1234"
        }
        const notPresentDoc = {
            "email": "somethingelse@gmail.com",
            "password": "nj1234"
        }

        it("doctor registered succesfully => status 200 with message", (done)=>{
            
            chai.request(server)
                .post("/doctors/login")
                .send(presentDoc)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('token');
                    token = response.body.token;
                done();
                })
        })
        // it("doctor already registered => status 404 with messsage", (done)=>{
        //     chai.request(server)
        //         .post("/doctors/register")
        //         .send(doc)
        //         .end((err, response) => {
        //             response.should.have.status(404);
        //             response.body.should.be.a('object');
        //             response.body.should.have.property('message').eq("doctor already registered");
                
        //         done();
        //         })
        // })
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