const mongoose = require('mongoose');

// 数据库连接 URI
const MONGODB_URI = "mongodb://root:9lgn5rh6@dbconn.sealoshzh.site:47746/?directConnection=true";
const MONGODB_DB = "todo-list-test-db-mongodb-0";

async function main() {
    try {
        // 连接数据库
        await mongoose.connect(MONGODB_URI, {
            dbName: MONGODB_DB
        });
        console.log('Connected to MongoDB');

        // 查询所有集合
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\nCollections:', collections.map(c => c.name));

        // 查询 users 集合
        console.log('\nUsers:');
        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log(JSON.stringify(users, null, 2));

        // 查询 verificationcodes 集合
        console.log('\nVerification Codes:');
        const codes = await mongoose.connection.db.collection('verificationcodes').find({}).toArray();
        console.log(JSON.stringify(codes, null, 2));

        // 查询 todos 集合
        console.log('\nTodos:');
        const todos = await mongoose.connection.db.collection('todos').find({}).toArray();
        console.log(JSON.stringify(todos, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

main(); 