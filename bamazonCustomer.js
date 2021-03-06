// Require MySQL and Inquirer
const mysql = require('mysql')
const inquirer = require('inquirer');
const colors = require('colors');

// Require custom modules
let {purchase, quantity} = require('./custom_modules/purchase');

// Make a connection to the database
const dbConnection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'bamazon'
});

// Create the inital query to the products table
dbConnection.query('SELECT * FROM products', function (error, results) {
	// Throw an error if the database cannot be queried. 
	if (error) {
		throw error;
	}
	//Initialize the products array this will be passed Inquirer to validate
	var productsArray = results;
	productsArray.map((item, index) => {
		// Alternate the colors for each product as they are displayed to the terminal
		var color = index % 2 === 0 ? "red" : "magenta";
		console.log(`Item ID: ${item.item_id} | Name: ${item.product_name} | Price: $${item.price}`[color]);
	});

	// Begin to ask the customer which product they would like to purchase and how many.	
	inquirer.prompt([{
		type: 'input',
		name: 'item_to_purchase',
		message: 'Enter the ID of the product you would like to purchase:',
		// Use the purchase function created by the purchase module to validate the customer's choice:
		// 1) Entry is a number
		// 2) Confirm the number is matches the ID of a product in the database
		validate: purchase
	}, {
		type: 'input',
		name: 'item_quantity',
		message: 'How many would you would like to purchase?',
		// Use the quantity function created by the purchase module to make sure there is enough of the product in stock to fulfill the customer's order.
		validate: quantity
	}]).then(function inqAnswers(answers) {
		console.log(answers);
		dbConnection.end();
	});
});