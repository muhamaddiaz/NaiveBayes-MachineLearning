const fs = require('fs')
const Papa = require('papaparse')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

const csvWriter = createCsvWriter({
    path: './TebakanTugas1ML.csv',
    header: [
      {id: 'tebakan', title: 'TEBAKAN'}
    ]
})

const testSetFile = fs.createReadStream('./TestsetTugas1ML.csv')
const trainSetFile = fs.createReadStream('./TrainsetTugas1ML.csv')

let Testing = []
let Trainer = []
let tebakan = []

function probabilityClass() {
  let yes = 0, nope = 0
  let y, n
  Trainer.map((row, index) => {
    if(row[7] == ">50K") {
      yes++
    } else {
      nope++
    }
  })
  y = yes / (yes + nope)
  n = nope / (yes + nope)
  return [
    y, n, yes, nope
  ]
}

function attributeProbabilityYes(...args) {
  var age = 0, workclass = 0, education = 0, marital = 0, occupation = 0, relationship = 0, hoursperweek = 0
  Trainer.map((row) => {
    if((args[0] == row[0]) && (row[7] == ">50K")) age++
  })
  Trainer.map((row) => {
    if((args[1] == row[1]) && (row[7] == ">50K")) workclass++
  })
  Trainer.map((row) => {
    if((args[2] == row[2]) && (row[7] == ">50K")) education++
  })
  Trainer.map((row) => {
    if((args[3] == row[3]) && (row[7] == ">50K")) marital++
  })
  Trainer.map((row) => {
    if((args[4] == row[4]) && (row[7] == ">50K")) occupation++
  })
  Trainer.map((row) => {
    if((args[5] == row[5]) && (row[7] == ">50K")) relationship++
  })
  Trainer.map((row) => {
    if((args[6] == row[6]) && (row[7] == ">50K")) hoursperweek++
  })

  return (
    (age/probabilityClass()[2]) * (workclass/probabilityClass()[2]) * 
    (education/probabilityClass()[2]) * (marital/probabilityClass()[2]) * 
    (occupation/probabilityClass()[2]) * (relationship/probabilityClass()[2]) * 
    (hoursperweek/probabilityClass()[2]) * probabilityClass()[0])
}

function attributeProbabilityNo(...args) {
  var age = 0, workclass = 0, education = 0, marital = 0, occupation = 0, relationship = 0, hoursperweek = 0
  Trainer.map((row) => {
    if((args[0] == row[0]) && (row[7] == "<=50K")) age++
  })
  Trainer.map((row) => {
    if((args[1] == row[1]) && (row[7] == "<=50K")) workclass++
  })
  Trainer.map((row) => {
    if((args[2] == row[2]) && (row[7] == "<=50K")) education++
  })
  Trainer.map((row) => {
    if((args[3] == row[3]) && (row[7] == "<=50K")) marital++
  })
  Trainer.map((row) => {
    if((args[4] == row[4]) && (row[7] == "<=50K")) occupation++
  })
  Trainer.map((row) => {
    if((args[5] == row[5]) && (row[7] == "<=50K")) relationship++
  })
  Trainer.map((row) => {
    if((args[6] == row[6]) && (row[7] == "<=50K")) hoursperweek++
  })

  return (
    (age/probabilityClass()[3]) * (workclass/probabilityClass()[3]) * 
    (education/probabilityClass()[3]) * (marital/probabilityClass()[3]) * 
    (occupation/probabilityClass()[3]) * (relationship/probabilityClass()[3]) * 
    (hoursperweek/probabilityClass()[3]) * probabilityClass()[1])
}

const trainSet = Papa.parse(trainSetFile, {
  delimiter: ',',
  complete: ({ data }) => {
    for(let i = 1; i < data.length; i++) {
      Trainer.push([data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6], data[i][7], data[i][8]])
    }
    const testSet = Papa.parse(testSetFile, {
      delimiter: ',',
      complete: ({ data }) => {
        data.map((value, index) => {
          if(index == 0) return
          if(attributeProbabilityYes(value[1], value[2], value[3], value[4], value[5], value[6], value[7]) > attributeProbabilityNo(value[1], value[2], value[3], value[4], value[5], value[6], value[7])) {
            tebakan.push({tebakan: ">50K"})
          } else {
            tebakan.push({tebakan: "<=50K"})
          }
        })
        csvWriter.writeRecords(tebakan).then(() => {
          console.log("Tebakan berhasil dibuat")
        })
        console.log(tebakan)
      }
    })
  }
})