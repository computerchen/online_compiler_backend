const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const fs = require('fs')
const path = require('path')
const {v1:uuid} = require('uuid')
const executeCpp = require('./executeCpp')
const executePy  = require('./executePy')

const app = express()

//建立文件夹，用于保存文件
const dirCodes = path.join(__dirname,'codes')
if(!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes,{recursive:true})
}

const generateFile = async (format,content) =>{
    const jobId = uuid();
    const fileName = `${jobId}.${format}`
    const filePath = path.join(dirCodes,fileName)
    await fs.writeFileSync(filePath,content)
    return filePath
}

//中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.status(200).json({messages:'visit root directory'})
})

app.post('/run',async (req,res)=>{
    const {language = 'cpp',code} = req.body
    console.log(language,'len:',code.length);

    if(code === undefined) {
        return res.status(400).json({message:'Empty code body'})
    }

    try {
        //保存到文件里面
        const filePath = await generateFile(language,code)
        
        if(language==='cpp'||language==='c')
            output =  await executeCpp(filePath)
        else if(language==='py') {
            console.log(filePath)
            output = await executePy(filePath)
        }
        return res.status(200).json({filePath,output})
    }
    catch(err) {
        return res.status(500).json(err)
    }
    

})

mongoose
    .connect('mongodb://localhost/compilerdb')
    .then(()=>{
        console.log("DB Connected success ...");
    })
    .then(()=>{
        app.listen(5000,()=>{
            console.log("Server running http://localhost:5000");
        })
    })