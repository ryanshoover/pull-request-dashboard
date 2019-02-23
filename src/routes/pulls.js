const express = require('express');
const getPulls = require( '../api' ).getPulls;

const router = express.Router();

/* GET pulls. */
router.get( '/', function( req, res ) {
	getPulls()
	.then( data => res.json( data ) )
	.catch( err => {
		res.json( {
			error: err,
		} );
	 } );
} );

module.exports = router;
