
## Backend Setup Instructions
1. Clone the repository and navigate to the 'server' folder in your terminal:
   ```
    cd server
    ```
2. Install the required Node.js packages by running:
    ```
    npm install
    ```
3. Next, ensure you have a `.env` file containing the below credentials

    ### Environment Variables

    ```
    JWT_SECRET=e5d477b86e46108076f109e3b958e1c7f1948659bb7c2dc00aa18c61a474b81d

    ACTIVATION_TOKEN_SECRET=e5d477b86e46108076f109e3b958e1c7f1948659bb7c2dc00aa18c61a474b81d

    PORT=5000

    MONGO_URI=mongodb+srv://nehagupta18oct:Nehamongo34@tumo.7tsryxw.mongodb.net/?retryWrites=true&w=majority&appName=tumo

    RAZORPAY_KEY_ID=rzp_test_ROhDid9hsKbY7e

    RAZORPAY_SECRET=5Gi8eIyTuZSd7m9mTuGcdXnj
    ```
4. To start the server, execute the following command:
    ```
    npm start
    ```