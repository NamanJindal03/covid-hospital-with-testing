
let mongoose = require("mongoose");
const Doctor = require('../models/doctor');
const Patient = require('../models/patient')
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
before((done)=>{
    Patient.remove({},(err) => {
        done();
    })
})
let token ="";
describe('Doctor API', () =>{
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
        
        it("doctor login succesfully => status 200 with message", (done)=>{
            const presentDoc = { 
                "email": "ashish99@gmail.com",
                "password": "nj1234"
            }
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
        it("doctor doesnt exist  => status 400 with messsage", (done)=>{
            const notPresentDoc = {
                "email": "somethingelse@gmail.com",
                "password": "nj1234"
            }
            chai.request(server)
                .post("/doctors/login")
                .send(notPresentDoc)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('error').eq("Invalid Username/Password");
                
                done();
                })
        })
        it("wrong password  => status 400 with messsage", (done)=>{
            const wrongDoc = {
                "email": "ashish99@gmail.com",
                "password": "nj12345"
            }
            chai.request(server)
                .post("/doctors/login")
                .send(wrongDoc)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('error').eq("Invalid Username/Password");
                
                done();
                })
        })
    })
    // describe("GET /patients/test", ()=>{
    //     it("get 200 json and a message", (done)=>{
    //         chai.request(server)
    //             .get("/patients/test")
    //             .end((err, response) => {
    //                 response.should.have.status(200);
    //                 response.body.should.be.a('object');
    //                 response.body.should.have.property('message').eq("test succesfull");
    //             done();
    //             })
    //     })
    // })

})
describe('Patient API', () =>{
    describe("POST /patients/register", ()=>{
        const patient = {
            "mobile": "9953179989"
        }
        it("patient registered succesfully => status 200 with message", (done)=>{
            console.log(token);
            chai.request(server)
                .post("/patients/register")
                .send(patient)
                .set({ "Authorization": `Bearer ${token}` })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message').eq("Patient registered successfully");
                done();
                })
        })
        it("patient already registered => status 200 with message", (done)=>{
            console.log(token);
            chai.request(server)
                .post("/patients/register")
                .send(patient)
                .set({ "Authorization": `Bearer ${token}` })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message').eq("Patient details");
                done();
                })
        })
    })

})
describe('Report Status API', () =>{
    let statusArray = ['Negative', 'Travelled-Quarantine', 'Symptoms-Quarantine', 'Positive-Admit'];
    let gibberishStatus = "nfeifn";
    for(let status in statusArray){
        describe(`GET /reports/${statusArray[status]}`, ()=>{
            it(`succesfully displayed all reports of status ${statusArray[status]} => status 200 with message`, (done)=>{
                chai.request(server)
                    .get(`/reports/${statusArray[status]}`)
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('message');
                        response.body.should.have.property('reports');
                    done();
                    })
            })
        })
    }
    describe(`GET /reports/${gibberishStatus}`, ()=>{
        it(`succesfully displayed all reports of status ${gibberishStatus} => status 200 with message`, (done)=>{
            chai.request(server)
                .get(`/reports/${gibberishStatus}`)
                .end((err, response) => {
                    response.should.have.status(401);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message').eq("Invalid details");
                done();
                })
        })
    })

})
