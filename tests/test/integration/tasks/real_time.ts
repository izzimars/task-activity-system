import http from "http";
import WebSocket from "ws";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { createExpressApp } from "../../../../src/config/express";
import { initializeWebSocketServer } from "../../../../src/websocket/server";
import taskFixtures from "../../fixtures/taskFixtures";
import states from "../../helpers/states";

chai.use(chaiHttp);

const app = createExpressApp();

describe("Real-time Tasks", () => {
  it("should broadcast websocket message when task is created", function (done) {
    this.timeout(15000);

    const token = process.env.PRIMARY_USER_TOKEN || states.primaryUser.token;
    const server = http.createServer(app);

    initializeWebSocketServer(server)
      .then(() => {
        server.listen(0, () => {
          const address = server.address();
          const port = typeof address === "object" && address ? address.port : 0;
          const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
          let sawReadyEvent = false;

          ws.on("message", (rawMessage) => {
            const parsedMessage = JSON.parse(rawMessage.toString()) as {
              event: string;
              action?: string;
              data?: { id?: string };
            };

            if (parsedMessage.event === "connection:ready") {
              sawReadyEvent = true;

              chai
                .request(app)
                .post("/api/v1/tasks")
                .set("Authorization", `Bearer ${token}`)
                .send({
                  ...taskFixtures.createPrimaryTask,
                  title: `Realtime ${Date.now()}`
                })
                .end((err) => {
                  if (err) {
                    ws.close();
                    server.close(() => done(err));
                  }
                });

              return;
            }

            if (sawReadyEvent && parsedMessage.event === "task:updated") {
              expect(parsedMessage).to.have.property("action", "created");
              expect(parsedMessage.data).to.have.property("id");
              ws.close();
              server.close(() => done());
            }
          });

          ws.on("error", (error) => {
            server.close(() => done(error));
          });
        });
      })
      .catch((error: unknown) => done(error));
  });
});
