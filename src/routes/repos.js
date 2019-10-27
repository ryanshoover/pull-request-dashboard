const express = require('express');
const getTeamRepos = require( '../api' ).getTeamRepos;

const router = express.Router();

/* GET pulls. */
router.get( '/', function( req, res ) {
	getTeamRepos()
	.then( data => res.json( data ) )
	.catch( err => {
		res.json( {
			error: err,
		} );
	 } );
} );

module.exports = router;
