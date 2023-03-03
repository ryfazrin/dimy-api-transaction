# HOW TO RUN

Run 
```
pnpm i

pnpm run serve
```

if command show 
```
Server running at port: 5000
MySQL Connected...
```
Server is run.

## How to Use

Use Posman

```
POST: http://localhost:5000/api/transaction
```
![postman tutorial](./img/postman-tutorial.jpg)

API contract/Request Data
```
{
  "id": 1001,
  "customer_address": 1,
  "total": 10000,
  "order_date": "2023-03-03 07:44:28",
  "order_items": [
    {
      "product_id": 1,
      "quantity": 2,
      "total_product": 2000
    },
    {
      "product_id": 2,
      "quantity": 1,
      "total_product": 2000
    },
    {
      "product_id": 3,
      "quantity": 2,
      "total_product": 6000
    }
  ],
  "order_payment_methods": [
    {
      "payment_method_id": 1,
      "amount": 4000,
      "status": 1
    },
    {
      "payment_method_id": 2,
      "amount": 6000,
      "status": 1
    }
  ]
}
```