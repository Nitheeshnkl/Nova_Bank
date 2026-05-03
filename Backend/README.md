
# NovaBank Platform API

This project is the Java Spring Boot backend API for the NovaBank digital banking platform. It uses MySQL for persistence and implements JWT authentication with session validation and request interceptors.

Users can register, log in, open new bank accounts, deposit and withdraw funds, transfer money between accounts, and make payments. The codebase follows clean design principles, including SOLID practices and modular REST API architecture.

## Features

- It includes Authentication and Authorization mechanisms. 
- Email control and verification mechanisms are also available.
- Rest API
- It adheres to SOLID principles and design patterns.
- Tüm platformlara destek

  
## API Usage

#### Dashboard Get Accounts

```http
  GET /app/dashboard
```

| Headers | Tip     | Açıklama                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `Bearer:{{access_token}}` | **Required** . Your API key. |

#### Get Payment History

```http
  GET /app/payment_history
```

| Headers | Tip     | Açıklama                       |
| :-------- | :------- | :-------------------------------- |
| `Authorization` | `Bearer:{{access_token}}` | **Required** . Your API key. |

#### Get Transaction History


```http
  GET /app/transaction_history
```

| Headers | Tip     | Açıklama                       |
| :-------- | :------- | :-------------------------------- |
| `Authorization` | `Bearer:{{access_token}}` | **Required** . Your API key. |

#### Post Create Account


```http
  POST /account/create_account
```

| Body | Type    | Description                      |
| :-------- | :------- | :-------------------------------- |
| `account_name` | `string` | **Required**  |
| `account_type` | `string` | **Required**  |

| Headers | Type     | Description                    |
| :-------- | :------- | :-------------------------------- |
| `Authorization` | `access_token` | **Required** . Your API key. |

#### Post Deposit Transaction


```http
  POST /transact/deposit
```

| Body | Type    | Description                      |
| :-------- | :------- | :-------------------------------- |
| `deposit_amount` | `string` | **Required**  |
| `account_id` | `int` | **Required**  |

| Headers | Type     | Description                    |
| :-------- | :------- | :-------------------------------- |
| `Authorization` | `access_token` | **Required** . Your API key. |
#### POST Transfer Transaction


```http
  POST /transact/transfer
```

| Body | Type    | Description                      |
| :-------- | :------- | :-------------------------------- |
| `sourceAccount` | `string` |**Required**  |
| `targetAccount` | `string` |**Required**  |
| `amount` | `string` | **Required** |

| Headers | Type     | Description                    |
| :-------- | :------- | :-------------------------------- |
| `Authorization` | `access_token` | **Required** . Your API key. |

#### Post Withdraw Transaction

```http
  POST /transact/withdraw
```
| Headers | Type     | Description                    |
| :-------- | :------- | :-------------------------------- |
| `Authorization` | `access_token` | **Required** . Your API key. |

| Body | Type    | Description                      |
| :-------- | :------- | :-------------------------------- |
| `withdrawal_amount` | `string` | **Required** |
| `account_id` | `string` |**Required**  |



#### Post Payment Transaction

```http
  POST /transact/payment
```
| Headers | Type     | Description                    |
| :-------- | :------- | :-------------------------------- |
| `Authorization` | `access_token` | **Required**. Your API key.. |

| Body | Type    | Description                      |
| :-------- | :------- | :-------------------------------- |
| `beneficiary` | `string` | **Required**  |
| `account_number` | `string` | **Required**  |
| `account_id` | `string` | **Required**   |
| `reference` | `string` | **Required**  |
| `payment_amount` | `string` | **Required** |


#### Get Verify Account


```http
  GET /verify?token={token}&code={code}
```

| Query Params | Value    | Description                    |
| :-------- | :------- | :-------------------------------- |
| `token` | `token` | **Required** . Token from your email |
| `code` | `code` | **Required** . Code from your email |


#### Post Register User


```http
  POST register?confirm_password=1234
```

| Body | Type    | Description                       |
| :-------- | :------- | :-------------------------------- |
| `first_name` | `string` |  **Required**. User email. |
| `last_name` | `string` |  **Required**. User email. |
| `email` | `string` |  **Required**. User email. |
| `password` | `string` |  **Required**. User password. |


#### Post Register Login


```http
  POST /login
```

| Body | Type    | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email` | `string` | **Required** . User email. |
| `password` | `string` | **Required** . User password. |




#### Get Transaction History


```http
  GET /logout
```

| Headers | Type     | Description                    |
| :-------- | :------- | :-------------------------------- |
| `Authorization` | `access_token` | **Required**. Your API key. |

## Email Configurations


I used ThunderBird for email configurations. I created email addresses on Local Host through Hmail Server.

![Uygulama Ekran Görüntüsü](Screenshot_2.png)

 I saved these email addresses using ThunderBird. That's it.

![Uygulama Ekran Görüntüsü](Screenshot_3.png)


## Database Structure

![Uygulama Ekran Görüntüsü](databasestructure.png)

## Distribution

1- Clone the project to your local machine.
2- Build and run the application using your preferred Java Development environment.

Start for Project

```bash
  maven build
```

```bash
  maven run
```

  
## application.properties

To run the project, update the following information in your application.properties file.

`spring.datasource.url`

`spring.datasource.username`

`spring.datasource.password`
  
## Tests

Postman

![Uygulama Ekran Görüntüsü](Screenshot_1.png)
## Technologies

**Framework:** Spring Boot

**Technologies:** MySql, Javax Servlet, Tomcat, Spring Security Crypto, Json Web Token, Interceptors
  
## Related projects

This backend is built for the NovaBank platform and integrates with the NovaBank React frontend client.

## Extracted Lessons

Java Spring usage, Enterprise architecture, Database architecture, Session architecture, JWT architecture, Interceptor usage, Exception Handling mechanism, Project configuration, and more.

  

  
