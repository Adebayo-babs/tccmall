const Product = require('../model/product');

const landingPage = (req, res) => {
  res.render('index');
}

const productView = (req,res) => {
  // console.log(req.params.category);
  // res.send("Processing");

  Product.find({category:req.params.category}, (err, result) => {
    if(result) {
      res.render('product', {result});
    }
  })
}

const viewDetails = (req,res) => {
  // console.log(req.params.productid);
  // res.send("Processing");

  Product.findOne({_id:req.params.productid}, (err, result) => {
    if(result){
      res.render('details', {r:result});
    }
  })
}

module.exports = ({
  landingPage,
  productView,
  viewDetails
});
