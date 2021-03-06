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
	description: 'A boring desktop is the sign of a boring life. Let\'s fix that.',
	icon: 'images-alt2',
	keywords: [ 'wallpaper' ],
	category,
	attributes,
	edit
} );
