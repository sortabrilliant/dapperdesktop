<?php

namespace SortaBrilliant\DapperDesktop\RestApi;

use WP_Error;
use WP_REST_Server;
use WP_REST_Request;
use SortaBrilliant\DapperDesktop\ImageEditor;

/**
 * Register Fancy Links REST API route.
 *
 * @return void
 */
function register_routes() {
	register_rest_route(
		'dapperdesktop/1.0',
		'/resize/(?P<id>[\d]+)',
		[
			[
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => __NAMESPACE__ . '\\handle_resize',
				'permission_callback' => __NAMESPACE__ . '\\permissions_check',
			]
		]
	);
}
add_action( 'rest_api_init', __NAMESPACE__ . '\\register_routes' );

/**
 * Checks if current user can resize images.
 *
 * @return true|WP_Error
 */
function permissions_check( WP_REST_Request $request ) {
	return current_user_can( 'edit_post', $request['id'] );
}

/**
 * Generate supported desktop/mobile sizes for the image.
 *
 * @return void
 */
function handle_resize( WP_REST_Request $request ) {
	return ImageEditor\resize( $request['id'] );
}
