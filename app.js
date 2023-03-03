const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./config/database');
const app = express();
const PORT = process.env.PORT || 5000;

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// create data / insert data
app.post('/api/transaction', (req, res) => {
  // buat variabel penampung data dan query sql
  const data = { ...req.body }
  // console.log('data:', data)
  // console.log('req.body: ', req.body)
  // const querySql = 'INSERT INTO customer SET ?';

  // // jalankan query
  // let sqlOrder = `INSERT INTO order_transaction SET id=${connection.escape(data.id)}, customer_address=${connection.escape(data.customer_address)}, total=${connection.escape(data.total)}, order_date=${connection.escape(data.date)}`

  // connection.query(sqlOrder, dataOrder, (err, rows, field) => {
  //     // error handling
  //     if (err) {
  //         return res.status(500).json({ message: 'Gagal insert data!', error: err });
  //     }

  //     // jika request berhasil
  //     res.status(201).json({ success: true, message: 'Berhasil insert data!' });
  // });

  let sqlOrder = 'INSERT INTO order_transaction SET ?'
  let dataOrder = {
    id: data.id,
    customer_address: data.customer_address,
    total: data.total,
    order_date: data.order_date
  }

  connection.beginTransaction(function (err) {
    if (err) { throw err; }

    const insertTransaction = new Promise((resolve, reject) => {
      connection.query(sqlOrder, dataOrder, (err, rows, field) => {
        // error handling
        if (err) {
          connection.rollback(function () {
            throw err;
          });

          return res.status(500).json({ message: 'Gagal insert data!', error: err });
        }

        resolve("Success!");
      });
    });

    insertTransaction.then(() => {
      let sqlOrderItems = 'INSERT INTO order_items SET ?'

      let insertItems = data.order_items.map(product => {
        let dataItem = {
          order_transaction_id: data.id,
          product_id: product.product_id,
          quantity: product.quantity,
          total_product: product.total_product
        }
        connection.query(sqlOrderItems, dataItem, (err, rows, field) => {
          // error handling
          if (err) {
            connection.rollback(function () {
              throw err;
            });

            return res.status(500).json({ message: 'Gagal insert data!', error: err });
          }
        });
      });

      // if (insertItems) {
      //   resolve("Success!");
      // }
    })
      .then(() => {
        connection.commit(function (err) {
          if (err) {
            return connection.rollback(function () {
              throw err;
            });
          }

          // jika request berhasil
          console.log('success!');
          res.status(201).json({ success: true, message: 'Berhasil insert data!' });
        });
      })
  });
});

// buat server nya
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));