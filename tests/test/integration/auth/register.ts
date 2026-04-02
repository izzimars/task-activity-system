import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { createExpressApp } from "../../../../src/config/express";
import { connectDatabase } from "../../../../src/config/database";
import userFixtures from "../../fixtures/userFixtures";
import states from "../../helpers/states";

chai.use(chaiHttp);

const app = createExpressApp();

describe("Auth Register", () => {
  before((done) => {
    connectDatabase()
      .then(() => done())
      .catch((error: unknown) => done(error));
  });

  it("should register user and return 201 with jwt", (done) => {
    chai
      .request(app)
      .post("/api/v1/auth/register")
      .send(userFixtures.registerPrimary)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(201);
        expect(res.body).to.have.property("id");
        expect(res.body).to.have.property("email", userFixtures.registerPrimary.email.toLowerCase());
        expect(res.body).to.have.property("token");

        states.primaryUser.id = res.body.id;
        states.primaryUser.token = res.body.token;
        states.primaryUser.email = res.body.email;
        process.env.PRIMARY_USER_ID = res.body.id;
        process.env.PRIMARY_USER_TOKEN = res.body.token;
        process.env.PRIMARY_USER_EMAIL = res.body.email;

        done();
      });
  });

  it("should fail with duplicate email", (done) => {
    chai
      .request(app)
      .post("/api/v1/auth/register")
      .send(userFixtures.registerPrimary)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(409);
        expect(res.body).to.have.property("message", "Email already registered");
        done();
      });
  });

  it("should fail when password is missing", (done) => {
    chai
      .request(app)
      .post("/api/v1/auth/register")
      .send(userFixtures.missingPassword)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message", "Validation failed");
        done();
      });
  });

  it("should fail when email format is invalid", (done) => {
    chai
      .request(app)
      .post("/api/v1/auth/register")
      .send(userFixtures.invalidEmail)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message", "Validation failed");
        done();
      });
  });
});
