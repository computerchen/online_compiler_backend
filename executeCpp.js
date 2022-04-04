const {exec} = require('child_process')
const fs = require('fs')
const { resolve } = require('path')
const path = require('path')
const {stdout,stderr} = require('process')

const outputPath = path.join(__dirname,'outputs')
if(!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath,{recursive:true})
}

const executeCpp = (filepath)=>{
    console.log(`Execute Cpp File${filepath}`)
    const jobId = path.basename(filepath).split('.')[0]

    if (process.platform === 'win32') {
        return new Promise((resolve,reject)=>{
            const outPath = path.join(outputPath,`${jobId}.exe`)
            const cmd = `g++ ${filepath} -o ${outPath} &&  ${outputPath}/${jobId}.exe `
            exec(
                `${cmd}`, 
                (error,stdout,stderr) =>{
                    error && reject({error,stderr})
                    stderr && reject(stderr)
                    resolve(stdout)
                }
            )
        })
    }
    else if(process.platform === 'win64'){
        return new Promise((resolve,reject)=>{
            const outPath = path.join(outputPath,`${jobId}.exe`)
            exec(
                `g++ ${filepath} -o ${outPath} ; cd  ${outputPath} ; ./${jobId}.exe`,{'shell':'powershell.exe'},
                (error,stdout,stderr) =>{
                    error && reject({error,stderr})
                    stderr && reject(stderr)
                    resolve(stdout)
                }
        )
        })
    }
    else {
        return new Promise((resolve,reject)=>{
            const outPath = path.join(outputPath,`${jobId}.out`)
            exec(
                `g++ ${filepath} -o ${outPath} && cd  ${outputPath} && ./${jobId}.out`,
                (error,stdout,stderr) =>{
                    error && reject({error,stderr})
                    stderr && reject(stderr)
                    resolve(stdout)
                }
            )
        })
    }
}

module.exports = executeCpp