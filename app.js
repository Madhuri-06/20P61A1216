const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const NUMBERS_API = {
    'p': 'http://20.244.56.144/test/primes',
    'f': 'http://20.244.56.144/test/fibonacci',
    'e': 'http://20.244.56.144/test/even',
    'r': 'http://20.244.56.144/test/random'
};

let numbersStore = [];

// Helper function to fetch numbers
const fetchNumbers = async (url) => {
    try {
        const response = await axios.get(url, { timeout: 500 });
        return response.data.numbers || [];
    } catch (error) {
        return [];
    }
};

// Helper function to update the numbers store
const updateStore = (newNumbers) => {
    newNumbers.forEach(number => {
        if (!numbersStore.includes(number)) {
            if (numbersStore.length >= WINDOW_SIZE) {
                numbersStore.shift();
            }
            numbersStore.push(number);
        }
    });
};

// Helper function to calculate average
const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
};

// Root route to confirm the server is running
app.get('/', (req, res) => {
    res.send('Average Calculator Microservice is running.');
});

app.get('/numbers/:numberid', async (req, res) => {
    const numberId = req.params.numberid;
    const apiUrl = NUMBERS_API[numberId];

    if (!apiUrl) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    const windowPrevState = [...numbersStore];
    const newNumbers = await fetchNumbers(apiUrl);
    updateStore(newNumbers);
    const windowCurrState = [...numbersStore];
    const average = calculateAverage(numbersStore);

    res.json({
        windowPrevState: windowPrevState,
        windowCurrState: windowCurrState,
        numbers: newNumbers,
        avg: parseFloat(average.toFixed(2))
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});