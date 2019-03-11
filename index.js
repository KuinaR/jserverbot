const express = require("express");
const filetype = require("file-type");
const http = require('http');
var app = express();
var bodyParser = require('body-parser');
var orders = [];

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json({ extended: false }));

//Funcion Especificación 2

function separarPalabras(palabras){
    var auxString = "";
    var allWords = [];
    var añadida = false;
    for(let i = 0; i < palabras.length; i++){
        if(palabras[i] != ','){
            auxString += palabras[i];
        }
        else{
            for(let j = 0; j < allWords.length; j++){
                if(auxString == allWords[j]){
                    añadida = true;
                }
            }
            if(!añadida){
                allWords.push(auxString);
            }
            else{
                añadida = false;
            }
            auxString = "";
        }
    }

    //Compruevo si la ultima es igual
    for(let j = 0; j < allWords.length; j++){
        if(auxString == allWords[j]){
            añadida = true;
        }
    }
    if(!añadida){
        allWords.push(auxString);
    }
    
    return allWords;
}

app.post('/removeduplicatewords', function(req, res){
    var words = [];
    var finalWords = "";
    words = separarPalabras(req.body.palabras);
    for(let i = 0; i < words.length; i++){
        finalWords += words[i];
        if((words.length - 1) != i){
            finalWords += ',';
        }
    }
    res.end(finalWords);
})

app.get('/botorder/:order', function(req, res){
    var isIn = false;
    
    if(orders[req.params.order] != null){
        isIn = true;
    }

    if(isIn){
        res.end(orders[req.params.order]);
    }
    else{
        res.end('NONE');
    }
})

app.post('/botorder/:order', function(req, res){
    orders[req.params.order] = req.body.botorder;
    res.end('OK');
})

app.post('/detectfiletype', function(req, res){
    var type;
    var json = "";
    console.log("The URL is: " + req.body.url);
    http.get(req.body.url, response => {
        response.on('readable', () => {
            const chunk = response.read(filetype.minimumBytes);
            response.destroy();
            //type = filetype(chunk);
            //res.end('type');
            if(filetype(chunk) != null){
                type = JSON.stringify(filetype(chunk));
                res.end(type);
                answer = true;
            }
            
            //=> {ext: 'gif', mime: 'image/gif'}
        });
    })
})


app.listen(8000);
