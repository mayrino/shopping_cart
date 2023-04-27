var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/shopping');

var products = [
  new Product({
    imagePath: "https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png",
    title: "Gothic Video Game",
    descrition: "Asesome Game",
    price: 10
  }),
  new Product({
    imagePath: "http://himg2.huanqiu.com/attachment2010/2013/0705/20130705035118403.jpg",
    title: "Warcraft Video Game",
    descrition: "very popular computer Game!!!!",
    price: 6
  }),
  new Product({
    imagePath: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=256191768,225587722&fm=26&gp=0.jpg",
    title: "CS Video Game",
    descrition: "CS Game is cop fight with torsist",
    price: 20
  }),
  new Product({
    imagePath: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497636142911&di=13aa04436477130ac158dd49b32bbecc&imgtype=0&src=http%3A%2F%2Fwww.lnjsports.com%2Fcatalog%2FSUPCOMMGOLD-f.jpg",
    title: "Thransform Video Game",
    descrition: "Thransform Game",
    price: 30
  }),
  new Product({
    imagePath: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497636236795&di=e3e595ed949c1fb968704a729d384214&imgtype=0&src=http%3A%2F%2Fecx.images-amazon.com%2Fimages%2FI%2F51okh12cI%2BL._UL500_.jpg",
    title: "ROOKMAN Video Game",
    descrition: "process restarted Game",
    price: 50
  })
];

var done = 0;

for (var i = 0; i< products.length; i++) {
    products[i].save(saveDone());
}

function saveDone(err,result){
        done++;
        if(done === products.length){
               exit();
        }       
}

function exit(){
  mongoose.disconnect();  
}
