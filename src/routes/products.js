const express = require('express');
const getProducts = require( '../api' ).getProducts;

const router = express.Router();

/* GET pulls. */
router.get( '/', function( req, res ) {
	getProducts()
	.then( data => res.json( data ) )
	.catch( err => {
		res.json( {
			error: err,
		} );
	 } );
} );

module.exports = router;
