
const express=require("express");
// const app =express();



const axios = require('axios');
const { MongoClient } = require('mongodb');

// MongoDB bağlantı URL'si
const mongoURL = 'mongodb://localhost:27017';
// MongoDB veritabanı adı
const dbName = 'mealsDB';
// MongoDB koleksiyon adı
const collectionName = 'meals';

// Express uygulaması oluştur
const app = express();
const PORT = process.env.PORT || 3000;

// Verileri çekmek için API URL'si
const apiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
console.log("init")

// Axios kullanarak API'den verileri çekme fonksiyonu
async function fetchMeals(dishName) {
    try {
        const response = await axios.get(apiUrl + dishName);
        return response.data.meals;
    } catch (error) {
        console.error('Veri çekme hatası:', error);
        return [];
    }
}

// MongoDB'ye veri eklemek için fonksiyon
async function insertMealsToDB(meals) {
    try {
        const client = new MongoClient(mongoURL);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        // Koleksiyona verileri ekleyin
        await collection.insertMany(meals);
        console.log('Veriler başarıyla MongoDB\'ye eklendi.');
    } catch (error) {
        console.error('MongoDB\'ye veri ekleme hatası:', error);
    }
}

// API endpoint'i
app.get('/fetchRecipes/:dishName', async (req, res) => {
    const dishName = req.params.dishName;
    const meals = await fetchMeals(dishName);
    
    
    if (meals.length > 0) {
        await insertMealsToDB(meals);
        res.json({ success: true, message: 'Meals fetched and inserted to MongoDB.', meals });
        console.log(meals)
    } else {
        res.json({ success: false, message: 'No meals found.' });
    }
});

// Sunucuyu dinle
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


function insertImage(container,imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.width = 300;
    img.height = 200;
    container.appendChild(img);
}
function insertParagraph(container,text) {
    const para = document.createElement('p');
    para.innerText = text;
    container.appendChild(para);
}
async function getData()
{
    // const response = await axios.get(apiUrl + "rice");
    const apiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
   const  query = document.getElementById("user-inp").value

    console.log(query)
    const response = await fetch(apiUrl + query)
    const data = await response.json();
    console.log(1)
    console.log(data.meals)
    
    
    const result = document.getElementById("result")
    result.innerHTML = ""; // clear div
    // result.appendChild(data.meals[0].desc)
    insertParagraph(result, data.meals[0].strMeal)
    insertImage(result, data.meals[0].strMealThumb)
    insertParagraph(result, data.meals[0].strInstructions)
    
}