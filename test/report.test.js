let mongoose = require("mongoose");
const Report = require('../models/report')
const chai = require("chai");
const server = require("../index");
const chaiHttp = require("chai-http");

//Assertion style
chai.should();
chai.use(chaiHttp);

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