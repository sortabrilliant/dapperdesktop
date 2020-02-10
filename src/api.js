/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

export default function resizeImageRequest( id ) {
	return apiFetch( {
		path: `dapperdesktop/1.0/resize/${ id }`,
		headers: {
			'Content-type': 'application/json',
		},
		method: 'POST',
	} );
}
