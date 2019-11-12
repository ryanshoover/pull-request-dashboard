const express = require('express');
const getDependencies = require( '../api' ).getDependencies;

const router = express.Router();

router.get( '/', function( req, res ) {
	getDependencies()
	.then( data => res.json( data ) )
	.catch( err => {
		res.json( {
			error: err,
		} );
	 } );
} );

module.exports = router;
