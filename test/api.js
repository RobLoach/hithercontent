var fs = require("fs"),
    hc_path = "../index.js",
    hithercontent = require(hc_path),
    auth = JSON.parse(fs.readFileSync("_auth.json", { "encoding": "utf8" })),
    expect = require("chai").expect,
    https = require("https"),
    sinon = require("sinon"),
    PassThrough = require("stream").PassThrough;

describe("Getting JSON from API", function() {

    beforeEach("using mock API to approximate GatherContent", function () {
        sinon.stub(https, "get", function (options, callback) {
            var request = new PassThrough(),
                response = new PassThrough(),
                auth_check = auth.user + ":" + auth.akey;
            if (typeof callback === "function") {
                callback(response);
            }
            if (options.hasOwnProperty("auth") && (options.auth === auth_check)) {
                response.write(JSON.stringify(options));
            } else {
                response.write("Invalid credentials.")
            }
            response.end();
            return request;
        });
    });

    afterEach("restoring real API call", function () {
        https.get.restore();
    });

    describe("without initialisation", function () {
        it("should return an empty object", function (done) {
            hithercontent.getJSONfromAPI("/items/0", function (data) {
                expect(data).to.be.empty;
                done();
            });
        })
    });

    describe("with initialisation", function () {

        before(function () {
            hithercontent.init(auth);
        });

        describe.skip("using an incorrect path", function () {
            it("should return an empty object", function (done) {
                hithercontent.getJSONfromAPI("/items/0", function (data) {
                    expect(data).to.be.empty;
                    done();
                });
            });
        });

        describe("with a correct path", function () {
            it("should return a usable data object", function (done) {
                hithercontent.getJSONfromAPI("/items/1512999", function (data) {
                    expect(data).to.be.an("object");
                    done();
                });
            })
        });

    });

});
