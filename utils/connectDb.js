import mongoose from 'mongoose';

const connection = {};

// Connect to database
async function connectDB() {
  // If there is already a connection to db, just return
  // No need to make a new connection
	if (connection.isConnected) {
		// Use existing database connection
		console.log('Using existing connection');
		return;
	}
	// Use new database connection when connecting for 1st time
	// 1st arg is the mongo-srv path that mongo generated for our db cluster
	// The 2nd arg is options object. Theses are deprecation warnings
	// mongoose.connect() returns a promise
	// What we get back from this is a reference to our database
	const db = await mongoose.connect(process.env.MONGO_SRV, {
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	console.log('DB Connected');
	connection.isConnected = db.connections[0].readyState;
}

export default connectDB;
