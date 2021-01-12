import chai from 'chai';
import chaiHttp from 'chai-http';
import models from '../src/models';
import app from '../src/app';
import sinon from 'sinon';
import {successSignUp,_} from '../src/controllers/googleSignup';
import { expect, request, use } from 'chai';



use(chaiHttp)

let req={body:{},
        user:{
          provider: 'google',
          sub: '106180666226862347646',
          id: '106180666226862347646',
          displayName: 'Niyonkuru Blaise',
          name: { givenName: 'Niyonkuru', familyName: 'Blaise' },
          given_name: 'Niyonkuru',
          family_name: 'Blaise',
          email_verified: true,
          verified: true,
          language: 'en',
          locale: undefined,
          email: 'blaiseniyonkuru12@gmail.com',
          emails: [ { value: 'blaiseniyonkuru12@gmail.com', type: 'account' } ],
          photos: [
            {
              value: 'https://lh3.googleusercontent.com/a-/AOh14Ghe0RBclUzQrw32zJrUjIY-uN7XjLnYNr4SIX7U=s96-c',
              type: 'default'
            }
          ]
        }};

let req2={body:{},
          user:{
            provider: 'google',
            sub: '10618066622686234753',
            id: '106180666226862347643',
            displayName: 'test one',
            name: { givenName: 'test', familyName: 'one' },
            given_name: 'test',
            family_name: 'one',
            email_verified: true,
            verified: true,
            language: 'en',
            locale: undefined,
            email: 'test@gmail.com',
            emails: [ { value: 'test@gmail.com', type: 'account' } ],
            photos: [
              {
                value: 'https://lh3.googleusercontent.com/a-/AOh14Ghe0RBclUzQrw32zJrUjIY-uN7XjLnYNr4SIX7U=s96-c',
                type: 'default'
              }
            ]
          }};

describe('#Sign Up with Google',()=>{
    beforeEach((done) => {
        models.User.destroy({where:{email:'test@gmail.com'}})
        .then(deleted=>{
          console.log('deleted');
        })
        .catch(err=>{
          console.log('not deleted')
        });
        done()
      });

    it('It should signIn a user with his google account', async ()=>{
        const res = await request(app).get('/api/v1/google/signUp').send(req);
          expect(res).to.have.status(200);
          res.body.should.be.a('Object');
          res.body.should.have.property('message').eql('successfully Logged In')
          done()
        })
      })

      it('It should first signUp a user if he has no account and then signIn the user',(done)=>{
          chai.request(app)
          .get('/api/v1/google/signUp')
          .send(req2)
          .end((err,res)=>{
            res.should.have.status(200);
            res.body.should.be.a('Object');
            res.body.should.have.property('message').eql('successfully Logged In')
            done()
          })  
    })
    it('It should redirect to signUp',(done)=>{
      let res={
        redirect:function(){}
      }
      successSignUp(req,res);
      const mock = sinon.mock(res);
      mock.expects("redirect").once().withExactArgs("/api/v1/google/signUp");
      done() 
})