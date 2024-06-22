const express = require("express");
const app = express();
const port = 9876;
const cors = require("cors");

app.use(cors());
let numbersStore = [];
const updateStore = (newNumbers) => {
  console.log(newNumbers);
  newNumbers.forEach((number) => {
    if (!numbersStore.includes(number)) {
      if (numbersStore.length >= WINDOW_SIZE) {
        numbersStore.shift();
      }
      numbersStore.push(number);
    }
  });
};

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

app.get("/register", (req, res) => {
  console.log(req);
  fetch("http://20.244.56.144/test/register", {
    method: "POST",
    body: JSON.stringify({
      companyName: "Test Company",
      ownerName: "Madhuri Devasani",
      rollNo: "20P61A1240",
      ownerEmail: "devasanimadhuri94@gmail.com",
      accessCode: "ordxkq",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      res.send(data);
    });
});

app.get("/auth", (req, res) => {
  fetch("http://20.244.56.144/test/auth", {
    method: "POST",
    body: JSON.stringify({
      companyName: "Test Company",
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      ownerName: "Madhuri Devasani",
      ownerEmail: "devasanimadhuri94@gmail.com",
      rollNo: "20P61A1240",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send({ error: "Failed to authenticate" });
    });
});

// Endpoint to get numbers based on the type
app.get("/numbers/:id", async (req, res) => {
  try {
    const authResponse = await fetch("http://localhost:9876/auth");
    const authData = await authResponse.json();
    const authorization = authData.access_token;

    console.log(authorization);

    let option;
    if (req.params.id === "e") {
      option = "even";
    } else if (req.params.id === "p") {
      option = "prime";
    } else if (req.params.id === "f") {
      option = "fibonacci";
    } else if (req.params.id === "r") {
      option = "random";
    } else {
      option = "invalid";
    }

    if (option === "invalid") {
      res.status(400).send({ error: "Invalid option" });
      return;
    }

    const numberResponse = await fetch(`http://20.244.56.144/test/${option}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
    });
    const numberData = await numberResponse.json();
    
    const newNumbers = numberData.numbers;
    const windowPrevState = [...numbersStore];
    updateStore(newNumbers);
    const windowCurrState = [...numbersStore];
    const average = calculateAverage(numbersStore);

    res.send({
      windowPrevState,
      windowCurrState,
      newNumbers,
      average,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ error: "Failed to fetch numbers" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
