const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');
var fsAsync = Promise.promisifyAll(require("fs"));

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
  let newPath = exports.dataDir;
  // console.log(newPath);
  fs.readdir(newPath, (err, items) => {
    if (err) {
      throw ('error writing readall');
    } else {
      var data = items.map( item => {
        var savedTodo = item.slice(0, -4); 
        var newDir = path.join(newPath, item);
        return fsAsync.readFileAsync(newDir)
          .then(fileData => {
            return { id: savedTodo, text: fileData.toString() };
          });
      }

        
      );
      Promise.all(data).then( (item) => { return callback(null, item)});
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

// Next, refactor the update function to rewrite the todo item 
// stored in the dataDir based on its id.

exports.update = (id, text, callback) => {
  // var item = items[id];
  let newPath = path.join(exports.dataDir, id + '.txt');
  
  fs.readFile(newPath, (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(newPath, text, (err) => {
        if (err) {
          throw ('error writing update');
        } else {
          // items[id] = text;
          callback(null, { id, text });
        }
      });
    }
  });
  

  
};


// fs.unlink('sample.txt', function (err) {
//     if (err) throw err;
//     // if no error, file has been deleted successfully
//     console.log('File deleted!');
// }); 
exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  let newPath = path.join(exports.dataDir, id + '.txt');
  fs.unlink(newPath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      console.log(id);
      console.log("it worked");
      callback();
    }
  });
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
