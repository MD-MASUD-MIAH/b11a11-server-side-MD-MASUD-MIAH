const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express') 
const app = express()
const cors = require('cors')
const admin = require("firebase-admin");
 const port  = process.env.PORT || 4000 
require('dotenv').config();

//  middle were  

app.use(express.json()) 
app.use(cors({
  origin: "https://blogs-website-a11b11.web.app",
  credentials: true}
))

app.get('/',(req,res)=>{


    res.send('Welcome to my new Blogs Website Assignment-11 Batch-11 ')
}) 

const decoded =Buffer.from(process.env.FB_SERVICE_KEY,'base64').toString('utf8')
const serviceAccount = JSON.parse(decoded)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const verifyToken =  async(req,res,next)=>{

  const authHeaders = req.headers.authorization

  if(!authHeaders || !authHeaders.startsWith('Bearer ')){

    return res.status(401).send({message:'unauthorized access token'}) 

  }
  

  const token = authHeaders.split(' ')[1]

  try{
    const decoded = await admin.auth().verifyIdToken(token)
 req.decoded = decoded
  
    
  }catch{

return res.status(401).send({message:'unauthorized access'})
  }
  next();
  

  
}

const verifyEmail = (req,res,next)=>{

 
 if(req.params.email !== req.decoded.email){

  return res.status(403).send({message:'forbidden access'})
 }
 next()
}



const client = new MongoClient(process.env.MONGODB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {

    try{

     const blogsCollection = client.db('addbolgs').collection('blogs')
     const wishListCollection = client.db('addbolgs').collection('wishList')
     const commentCollection = client.db('addbolgs').collection('comment')
app.get('/blogs/:id',async(req,res)=>{

   const id = req.params.id;
    const query = { _id:new ObjectId(id) };
    const result = await blogsCollection.findOne(query);

 res.send(result)
})



app.put('/blogs/:id',verifyToken,async(req,res)=>{


  const id = req.params.id  
  const userEmail = req.decoded.email
  const filter = {_id:new ObjectId(id)} 

  const blogsCheck = await blogsCollection.findOne({_id:new ObjectId(id)}) 

  if(!blogsCheck){

    return res.status(403).send({message:'blog not found'})
  }
     
      
  if(blogsCheck.email !== userEmail){

    return res.status(403).send({message:'forbidden access'})
  }
 const options = { upsert: true };
 const blogsUpdate = req.body 

 
  const plantDoc = {
        $set: blogsUpdate,
      };
 const result = await blogsCollection.updateOne(filter,plantDoc,options)

      res.send(result)

})

app.get('/allBlogs',async(req,res)=>{
     const category = req.query.category;
    const filter = category ? { category: category } : {};
   const blogs = await blogsCollection.find(filter).toArray() 
 res.send(blogs)
})

app.get('/search',async(req,res)=>{
     const title = req.query?.title
   
    
     
     const filter = title? { title: { $regex: title, $options: 'i' } }
    : {};
   const blogs = await blogsCollection.find(filter).toArray() 
 res.send(blogs)
})


app.get('/blogs',async(req,res)=>{

 const allblogs = await blogsCollection.find().sort({addedTime: -1 }).toArray();
 
  res.send(allblogs)


})

 app.post('/blogs',verifyToken,async(req,res)=>{

  const newBolgs = req.body 

 
  
  const result = await blogsCollection.insertOne(newBolgs)
  res.send(result)

   })


 app.post("/place-wishList", async (req, res) => {
    
      const wishList = req.body;
    
      const result = await wishListCollection.insertOne(wishList);
     

      res.status(201).send(result);
    });


app.post('/comment',async(req,res)=>{

  const userComment = req.body 

 
  const result = await commentCollection.insertOne(userComment) 

  res.send(result)
  
})


app.get('/comment/:id',async(req,res)=>{

   const id = req.params.id
   const filter = {blogId:id}
  
  
   
   
  const result = await commentCollection.find(filter).toArray() 

  res.send(result)

})


 app.get("/my-wishList/:email",verifyToken,verifyEmail, async (req, res) => {
     
    
      const email = req.params?.email;

  
  
      
     
      const filter = {  wisherEmail: email };
      const allWishList = await wishListCollection.find(filter).toArray();
   

      // for (const wish of allWishList) {
      //   const orderId = wish.wishId;
      //   const fullBlogData = await blogsCollection.findOne({
      //     _id: new ObjectId(orderId),
      //   });
      //  wish.title = fullBlogData?.title;
      //  wish.image = fullBlogData?.image;
      //  wish.category = fullBlogData?.category;
      //  wish.shortDec = fullBlogData?.shortDesc;
      // }

      res.send(allWishList);
    });

// app.get('/wishList/:id',async(req,res)=>{

//   const id = req.params.id

//   const query = {_id:new ObjectId(id)}
//   const result = await wishListCollection.findOne(query)

//   res.send(result)
// })
app.get('/topTen',async(req,res)=>{

    const data = await blogsCollection.aggregate([
      {
        $addFields: {
          longDescLength: { $strLenCP: { $ifNull: ["$longDesc", ""] } }
        }
      },
      {
        $sort: { longDescLength: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          longDescLength: 0
        }
      }
    ]).toArray();

    res.send(data)


})

app.delete('/wishList/:id',async(req,res)=>{

const id = req.params.id 
const query =  {_id: new ObjectId(id) }

const result = await  wishListCollection.deleteOne(query) 
res.send(result)

})


    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }finally{


    }
    
}

run().catch(console.dir)

app.listen(port,()=>{


    console.log(`My port is running here ${port}`);
    
})