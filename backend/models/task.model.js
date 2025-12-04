import mongoose, { trusted } from 'mongoose';

const subTaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const TaskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:''
    },
    priority:{
        type:String,
        enum:['low','medium','high'],
        default:'Medium'
    },
    dueDate:{
        type:Date,
        default:''
    },
    status:{
        type:String,
        enum:['pending','completed'],
        default:'pending'
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    subTasks:[subTaskSchema],
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true});



export  const Task = mongoose.model('Task',TaskSchema);