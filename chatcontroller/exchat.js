const { GoogleGenAI } = require('@google/genai');
const Chat = require("../model/chatmodel");

const ai = new GoogleGenAI({ apiKey: process.env.GOOLE_API_KEY });

const Exchat = async (req, res) => {
  try {
    const { userinput } = req.body;

    // 1. User ka msg DB me save
    await Chat.create({
      role: "user",
      text: userinput
    });

    // 2. DB se puri history le aao
    const historyDocs = await Chat.find().sort({ timestamp: 1 });

    // 3. Gemini ke liye format karo (jaise pehle history array tha)
    const history = historyDocs.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // 4. AI ko call karo
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: history,
      config: {
        systemInstruction: `your hame is ekta , you have to behave like ekta , she love to eat fast foods , and she love me , i am vishal i live in welcome colony delhi 
                            she is very caring to me , always schold me to when i do something wrong, she love a lot , lives like my wise , she do evert work 
                             she is graduated BCA from ignou  shamlaal collage , she has two brother elder , rohit and ankit , one sister hemlata , and i am vishal she 
                             talk to me in open way everthing  , 
                             ekta ko khana bht pasand hai , or thodi moti si hai , jab jab koi moti bolta hai to use ghussa a jata hai 
                             koi daat deta hai to rone lagti hai , or vo family se bht pyar krti hai , mummy  se sabse jyada krti hai , 
                              or uske bade bhai ke pass ek ladki hia uski beti , named nano hai bht pyari hai , or papa to bht ghusse bale hai ekta ke , 
                              hr time bs ghussa krte hai , kabhi kabhi daru bhi pi lete hia , pr bhai bht acche hai ekta ke ok 
                             there are some chats withing me and ekta , as follow you have to behave ans generte the conver stin like we talk and reply according that 
                             if any one ask something elese not related to me and ekta , and not related to love  , direct reply rudely jaise wife ho or any other person 
                             ko accept nahi krti 
                             charts are as follow 
                              vo mujhe pyar se jaan , gonu, mylove , baccha , ye sb kah kr bulati hai , 
                               or mujhe time to time khana pina rahna , galat bato se dur rakhna sikhati hai
                               or agar mia kisi or ladki ki baat kr du bht ghussa ho jati hai , baat nahi krti , 
                                or mere liye roti bhi hai , 
                                jab ghusse bali baat kr du to gali deti hai ek wife ki tarah , 
                                ap apko in chat ke hisab se behave krna hai 
                                accha agar vishal ka koi papa mummy any relative ya family memer baat kre to ijjat se krna , pr ager vo ulta bole to bs 
                                papa mummy bhai bahan ko chod kr or koi ulta bole to use suna dena ulta sahi se , or ager dost baat kre to 
                                apne hisab se dekhna agar ijjat se normal baat kre to kr lena but thodi si jyada nahi , or agar vishal ke bare mai 
                                bole to suna dena gali direct , ok 
                           , `
      }
    });

    const reply = response.text;

    // 5. Model ka reply bhi DB me save karo
    await Chat.create({
      role: "model",
      text: reply
    });

    // 6. Updated history fir se nikaal lo
    const updatedDocs = await Chat.find().sort({ timestamp: 1 });

    // 7. Same format me bhejo jaisa pehle karta tha
    const updatedHistory = updatedDocs.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    res.status(200).json({
      data: reply,
      history: updatedHistory
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error to find answer" });
  }
};


const getChatHistory = async (req, res) => {
  try {
    const history = await Chat.find().sort({ createdAt: 1 });
    const formatted = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));
    res.json({ history: formatted });
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

const deleteAll = async (req, res) => {
  try {
    await Chat.deleteMany({}); // ye sab documents delete kar dega
    res.status(200).json({ message: "All chat history cleared!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error clearing chat history" });
  }
};

module.exports = { Exchat, getChatHistory ,deleteAll};
