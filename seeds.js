var mongoose    = require('mongoose'),
    User        = require('./models/user'),
    Comment     = require('./models/comment'),
    Product     = require('./models/product'),
    Transaction = require('./models/transaction');

var dataProduk = [
    {
        productName	: "Buku Tulis",
        price		: 12000,
        discount	: 0,
        category	: "Alat Tulis",
        stock		: 1000,
        image		: "",
        description	: "Buku tulis berkualitas, ukuran B5 dengan garis 0.8mm. Kertas yang digunakan berwarna kuning sehingga tidak menyakitkan mata",
        comments	: []
    },
    {
        productName	: "Ballpoint",
        price		: 2500,
        discount	: 0,
        category	: "Alat Tulis",
        stock		: 1500,
        image		: "",
        description	: "Tersedia dalam berbagai warna, nyaman digunakan, tinta tidak mudah macet.",
        comments	: []
    },
    {
        productName	: "Pensil",
        price		: 1800,
        discount	: 0,
        category	: "Alat Tulis",
        stock		: 800,
        image		: "",
        description	: "Pensil, tersedia dalam berbagai ketebalan, dari HB hingga B8",
        comments	: []
    }
]

function seedDB() {
    dataProduk.forEach(function(seed){
        Product.create(seed, function(err, product){
            if (err) {
                console.log(err)
            }
        })
    })
}

module.exports = seedDB;