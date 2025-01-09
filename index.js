const express = require("express")
const cors = require("cors");
require("dotenv").config();

const app = express();
const { initializeDatabase } = require("./db/db.connect")
const Hotel = require("./models/hotel.models")

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};
  
app.use(cors(corsOptions));
app.use(express.json());

initializeDatabase();

async function readAllHotels(){
    try{
        const allHotels = await Hotel.find()
        return allHotels;
    }
    catch(error){
        throw error
    }
}

app.get("/hotels", async (req, res) => {
    try{
        const hotels = await readAllHotels();
        if(hotels.length > 0){
            res.json(hotels);
        }
        else{
            res.status(404).json({error: "No hotels found."});
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to fetch hotels."});
    }    
})

async function deleteHotel(hotelId){
    try{        
        const deletedHotel = await Hotel.findByIdAndDelete(hotelId);        
        return deletedHotel;
    }
    catch(error){
        console.log(error);
    }
}

app.delete("/hotels/:hotelId", async (req,res) => {
    try{        
        const deletedHotel = await deleteHotel(req.params.hotelId);  
        if(deletedHotel){
            res.status(200).json({message: "Hotel deleted successfully."});
        }              
    }
    catch(error){
        res.status(500).json({error: "Failed to delete hotel."});
    }
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});