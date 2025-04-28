import mongoose from 'mongoose';


mongoose.set('strictQuery', false);
// export const mon = mongoose.connect('mongodb+srv://careerpane:CareerPane1234@jobportal.dg2edwj.mongodb.net/?retryWrites=true&w=majority',{useNewUrlParser:true});
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cp-back";

export const mon = mongoose
.connect(MONGO_URI)
.then(() => console.log("Mongodb connected"))
.catch((err) => console.log(err));


export default mon;