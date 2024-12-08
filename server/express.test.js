const axios = require("axios");

test("Check that the webserver is listening on port 8000", async () => {
    const response = await axios.get("http://localhost:8000/");
    expect(response.data.message).toBe("Running");
});