<?php

namespace SortaBrilliant\DapperDesktop\Block;

use SortaBrilliant\DapperDesktop\ImageEditor;
use const SortaBrilliant\DapperDesktop\PLUGIN_DIR;
use const SortaBrilliant\DapperDesktop\PLUGIN_FILE;

/**
 * Registers the block and required assets.
 *
 * @return void
 */
function register_block() {
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}

	$asset_filepath = PLUGIN_DIR . '/build/index.asset.php';
	$asset_file     = file_exists( $asset_filepath ) ? include $asset_filepath : [
		'dependencies' => [],
		'version'      => false,
	];

	wp_register_script(
		'dapper-desktop',
		plugins_url( 'build/index.js', PLUGIN_FILE ),
		$asset_file['dependencies'],
		$asset_file['version']
	);

	wp_register_script(
		'dapper-desktop-theme-script',
		plugins_url( 'build/theme.js', PLUGIN_FILE ),
		$asset_file['dependencies'],
		$asset_file['version']
	);

	wp_register_style(
		'dapper-desktop-style',
		plugins_url( 'build/style.css', PLUGIN_FILE ),
		[],
		$asset_file['version']
	);

	wp_register_style(
		'dapper-desktop-editor-style',
		plugins_url( 'build/editor.css', PLUGIN_FILE ),
		[],
		$asset_file['version']
	);

	register_block_type( 'sortabrilliant/dapper-desktop', [
		'editor_script'   => 'dapper-desktop',
		'editor_style'    => 'dapper-desktop-editor-style',
		'style'           => 'dapper-desktop-style',
		'render_callback' => __NAMESPACE__ . '\\render_block',
	] );
}
add_action( 'init', __NAMESPACE__ . '\\register_block' );

/**
 * Dynamic block renderer.
 *
 * @param array $attributes
 * @return void
 */
function render_block( $attributes ) {
	$data = ImageEditor\get_image_data( $attributes );

	// Enqueue conditional script.
	wp_enqueue_script( 'dapper-desktop-theme-script' );
	
	extract( [ 'data' => $data ], EXTR_SKIP );

	ob_start();

	require PLUGIN_DIR . '/views/dynamic-block.php';

	return ob_get_clean();
}
