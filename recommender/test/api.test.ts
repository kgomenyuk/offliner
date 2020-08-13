import request from "supertest";
import app from "../src/app";

// проверка метода рекомендаций по категориям клиента
describe("GET /api/usercategory/f/25/27", () => {
    it("should return 200 OK", () => {
        return request(app)
            .get("http://localhost:3000/api/usercategory/f/25/27")
            .expect(200);
    });
});
