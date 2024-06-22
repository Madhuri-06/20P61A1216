const express = require("express");
const app = express();
const port = 9876;
const cors = require("cors");

app.use(cors());
let numbersStore = [];
let WINDOW_SIZE = 10;
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
    });
});

app.get("/numbers/:id", async (req, res) => {
  const authorization = await fetch("http://localhost:9876/auth")
    .then((response) => response.json())
    .then((data) => {
      return data.access_token;
    });
  console.log(authorization);
  let option;
  console.log(req.params.id);
  if (req.params.id === "e") {
    option = "even";
  } else if (req.params.id === "p") {
    option = "primes";
  } else if (req.params.id === "f") {
    option = "fibo";
  } else if (req.params.id === "r") {
    option = "rand";
  } else {
    option = "invalid";
  }
  console.log(option);
  try {
    fetch(`http://20.244.56.144/test/${option}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authorization,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const windowPrevState = [...numbersStore];
        console.log(data);
        const newNumbers = data.numbers;
        console.log(newNumbers);
        updateStore(newNumbers);
        const windowCurrState = [...numbersStore];
        const average = calculateAverage(numbersStore);
        res.send({
          windowPrevState,
          windowCurrState,
          newNumbers,
          average,
        });
      });
  } catch (err) {
    console.log("err");
  }
});

app.get(
  "/products/:companyName/:category?top=:top&minPrice=:min&maxPrice=:max",
  (req, res) => {
    const { companyName, category, top, min, max } = req.params;
    console.log(companyName, category, top, min, max);
    const authorization = fetch("http://localhost:9876/auth")
      .then((response) => response.json())
      .then((data) => {
        return data.access_token;
      });
    try {
      fetch(
        `http://9876/test/companies/${companyName}/categories/${category}?top=${top}&minPrice=${min}&maxPrice=${max}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authorization,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          res.send(data);
        });
    } catch (err) {
      console.log("err");
    }
  }
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
