import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { createExpressApp } from "../../../../src/config/express";
import taskFixtures from "../../fixtures/taskFixtures";
import states from "../../helpers/states";

chai.use(chaiHttp);

const app = createExpressApp();

describe("Get Tasks", () => {
  before((done) => {
    const token = process.env.SECONDARY_USER_TOKEN || states.secondaryUser.token;

    chai
      .request(app)
      .post("/api/v1/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send(taskFixtures.createSecondaryTask)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        states.tasks.secondaryTaskId = res.body.id;
        process.env.SECONDARY_TASK_ID = res.body.id;
        done();
      });
  });

  it("should return only authenticated user tasks", (done) => {
    const token = process.env.PRIMARY_USER_TOKEN || states.primaryUser.token;
    const primaryUserId = process.env.PRIMARY_USER_ID || states.primaryUser.id;

    chai
      .request(app)
      .get("/api/v1/tasks")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("tasks");
        expect(res.body.tasks).to.be.an("array");
        expect(res.body.tasks.length).to.be.greaterThan(0);

        res.body.tasks.forEach((task: { created_by: string }) => {
          expect(task.created_by).to.equal(primaryUserId);
        });

        done();
      });
  });

  it("should fail with 401 when token is missing", (done) => {
    chai
      .request(app)
      .get("/api/v1/tasks")
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(401);
        expect(res.body).to.have.property("message", "Unauthorized");
        done();
      });
  });
});
