const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  
  // var id = 
  counter.getNextUniqueId((err, id) => {
    
    let newPath = path.join(exports.dataDir, id + '.txt');
    // console.log("typeof text", typeof text);
    fs.writeFile(newPath, text, function(err) {
      if (err) {
        throw ('error writing counterString');
      } else {
        callback(null, {id, text});
      }
    });
  });
  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  var data = [];
  let newPath = exports.dataDir;
  // console.log(newPath);
  fs.readdir(newPath, (err, items) => {
    if (err) {
      throw ('error writing readall');
    } else {
      _.each(items, (id) => {
        var savedTodo = id.slice(0, -4);
        data.push({ id: savedTodo, text: savedTodo });
      });
      callback(null, data);
    }
    
  });
  
};

// Next, refactor the readOne to read a todo item from 
// the dataDir based on the message's id. 
// For this function, you must read the contents of the 
// todo item file and respond with it to the client.


exports.readOne = (id, callback) => {
  // var text = items[id];
  let newPath = path.join(exports.dataDir, id + '.txt');
  // console.log(newPath);
  fs.readFile(newPath, (err, fileData) => {
    if (!fileData) {
      // console.log("fileData ", fileData);
      callback(new Error(`No item with id: ${id}`));
    } else {
      // console.log("success fileData: ", fileData.toString());
      callback(null, { id, text: fileData.toString() });
      
    }

  });
  
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
