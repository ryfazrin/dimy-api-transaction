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
  const data = { ...req.body }

  let sqlOrder = 'INSERT INTO order_transaction SET ?'
  let dataOrder = {
    id: data.id,
    customer_address: data.customer_address,
    total: data.total,
    order_date: data.order_date
  }

  connection.beginTransaction(function (err) {
    if (err) { throw err; }

    // insert order transaction
    const insertTransaction = new Promise((resolve, reject) => {
      connection.query(sqlOrder, dataOrder, (err, rows, field) => {
        // error handling
        if (err) {
          connection.rollback(function () {
            throw err;
          });

          return res.status(500).json({ message: 'Gagal insert data!', error: err });
        }

        resolve(true);
      });
    });

    // insert product to order_items
    insertTransaction.then(() => {
      let sqlOrderItems = 'INSERT INTO order_items SET ?'

      data.order_items.map(product => {
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
    })
    // insert payment_method to order_payment_methods
      .then(() => {

        let sqlOrderPayMethods = 'INSERT INTO order_payment_methods SET ?'

        data.order_payment_methods.map(payMethod => {
          let dataPayMethod = {
            order_transaction_id: data.id,
            payment_method_id: payMethod.payment_method_id,
            amount: payMethod.amount,
            status: payMethod.status
          }
          connection.query(sqlOrderPayMethods, dataPayMethod, (err, rows, field) => {
            // error handling
            if (err) {
              connection.rollback(function () {
                throw err;
              });

              return res.status(500).json({ message: 'Gagal insert data!', error: err });
            }
          });
        });
      })
    // commit trasaction sql
      .then(() => {
        connection.commit(function (err) {
          if (err) {
            return connection.rollback(function () {
              throw err;
            });
          }

          // if request success
          console.log('success!');
          res.status(201).json({ success: true, message: 'Berhasil insert data!' });
        });
      })
  });
});

// buat server nya
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));