<?php

namespace SortaBrilliant\DapperDesktop\ImageEditor;

use WP_Error;

const DESKTOP_SIZES = [
	'5K' => [
		'width'  => 5120,
		'height' => 2880,
	],
	'4K' => [
		'width'  => 3840,
		'height' => 2160,
	],
	'2K' => [
		'width'  => 2560,
		'height' => 1440,
	],
	'FHD' => [
		'width'  => 1920,
		'height' => 1080,
	],
	'HD' => [
		'width'  => 1280,
		'height' => 720,
	],
];

const MOBILE_SIZES = [
	'2K' => [
		'width'  => 1440,
		'height' => 2560,
	],
	'FHD' => [
		'width'  => 1080,
		'height' => 1920,
	],
	'HD' => [
		'width'  => 720,
		'height' => 1280,
	],
];

/**
 * Resize the image.
 *
 * @param int $image_id Attachment ID.
 * @return bool|WP_Error
 */
function resize( $image_id, $type = 'desktop' ) {
	$image_meta = wp_get_attachment_metadata( $image_id );
	$image_file = get_attached_file( $image_id );

	// Get the original image.
	if ( empty( $image_meta['original_image'] ) ) {
		$original_image = $image_file;
	} else {
		$original_image = path_join( dirname( $image_file ), $image_meta['original_image'] );
	}

	$editor = wp_get_image_editor( $original_image );

	if ( ! $editor->load() ) {
		return new WP_Error( 'fileload', 'Unable to load original media file.' );
	}

	$sizes         = ( $type === 'desktop' ) ? DESKTOP_SIZES : MOBILE_SIZES;
	$created_sizes = $editor->multi_resize( $sizes );

	if ( empty( $created_sizes ) ) {
		return new WP_Error( 'resize', 'Unable to resize original media file.' );
	}

	$image_meta['sizes'] = array_merge( $image_meta['sizes'], $created_sizes );
	wp_update_attachment_metadata( $image_id, $image_meta );

	return true;
}

/**
 * Retrieves the image's various size path, width, and height.
 *
 * @param int $image_id
 * @return array $data
 */
function get_image_data( $image_id, $type = 'desktop' ) {
	$imagedata = wp_get_attachment_metadata( $image_id );
	$data      = [
		'sizes' => [],
		'url'   => wp_get_attachment_url( $image_id ),
	];

	if ( ! is_array( $imagedata ) || empty( $imagedata['sizes'] ) ) {
		return $data;
	}

	// Get only sizes we need.
	$supported = ( $type === 'desktop' ) ? DESKTOP_SIZES : MOBILE_SIZES;
	$sizes     = array_intersect_key( $imagedata['sizes'], $supported );

	if ( empty( $sizes ) ) {
		return $data;
	}

	foreach ( $sizes as $name => $size ) {
		$data['sizes'][ $name ] = [
			'size' => sprintf( '%1$dx%2$d', $size['width'], $size['height'] ),
			'url'  => path_join( dirname( $data['url'] ), $size['file'] )
		];
	}

	return $data;
}
