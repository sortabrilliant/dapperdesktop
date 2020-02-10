/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

const { name, category, attributes } = metadata;

registerBlockType( name, {
	title: 'Dapper Desktop',
	description: '',
	icon: 'images-alt2',
	keywords: [ 'wallpaper' ],
	category,
	attributes,
	edit
} );
