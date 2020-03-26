/**
 * External dependencies
 */
import classnames from 'classnames';
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
import { isBlobURL } from '@wordpress/blob';
import {
	BlockControls,
	BlockIcon,
	InspectorControls,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck
} from '@wordpress/block-editor';
import {
	Button,
	IconButton,
	PanelBody,
	SelectControl,
	Spinner,
	Toolbar,
	withNotices
} from '@wordpress/components';
import { Component } from '@wordpress/element';
import { compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import resizeImageRequest from './api';

const ALLOWED_MEDIA_TYPES = [ 'image' ];

const TYPE_OPTIONS = [
	{ label: 'Desktop', value: 'desktop' },
	{ label: 'Mobile', value: 'mobile' },
];

class Edit extends Component {
	constructor( { attributes } ) {
		super( ...arguments );
		this.resizeImage = this.resizeImage.bind( this );
		this.onUploadError = this.onUploadError.bind( this );
		this.onSelectImage = this.onSelectImage.bind( this );
		this.onSelectType = this.onSelectType.bind( this );

		this.state = {
			isEditing: ! attributes.url,
			inProgress: null,
		};
	}

	resizeImage() {
		const { attributes, setAttributes, noticeOperations } = this.props;
		const { id, type } = attributes;

		this.setState( { inProgress: true } );
		noticeOperations.removeAllNotices();

		resizeImageRequest( id, { type } )
			.then( () => {
				this.setState( { inProgress: null } );
				setAttributes( { isResized: true } );
			} )
			.catch( ( error ) => {
				noticeOperations.createErrorNotice( error.message );
				this.setState( { inProgress: null } );
			} );
	}

	onUploadError( message ) {
		const { noticeOperations } = this.props;

		noticeOperations.createErrorNotice( message );
		this.setState( { isEditing: true, } );
	}

	onSelectImage( media ) {
		if ( ! media || ! media.url ) {
			this.props.setAttributes( {
				id: undefined,
				url: undefined,
				isResized: false,
			} );
			return;
		}

		const url = get( media, [ 'sizes', 'large', 'url' ] ) || media.url;

		this.setState( {
			isEditing: false,
		} );


		this.props.setAttributes( {
			url,
			id: media.id,
			isResized: false,
		} );
	}

	onSelectType( type ) {
		this.props.setAttributes( {
			type,
			isResized: false,
		} );
	}

	render() {
		const { isEditing, inProgress } = this.state;
		const { attributes, className, noticeUI } = this.props;
		const { id, url, type, isResized } = attributes;
		const hideResizeButton = inProgress || isBlobURL( url );

		if ( isEditing || ! url ) {
			return (
				<>
					<MediaPlaceholder
						icon={ <BlockIcon icon="images-alt2" /> }
						onSelect={ this.onSelectImage }
						notices={ noticeUI }
						labels={ { title: 'Wallpaper' } }
						onError={ this.onUploadError }
						accept="image/*"
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						value={ { id, src: undefined } }
					/>
				</>
			);
		}

		const editButton = (
			<>
				<MediaUploadCheck>
					<Toolbar>
						<MediaUpload
							onSelect={ this.onSelectImage }
							allowedTypes={ ALLOWED_MEDIA_TYPES }
							value={ id }
							render={ ( { open } ) => (
								<IconButton
									className="components-toolbar__control"
									label="Edit image"
									icon="edit"
									onClick={ open }
								/>
							) }
						/>
					</Toolbar>
				</MediaUploadCheck>
			</>
		);

		const resizeButton = ! isResized && (
			<>
				<Button
					isPrimary
					className="editor-media-placeholder__button"
					onClick={ this.resizeImage }
				>
					Create wallpaper files
				</Button>
			</>
		);

		const controls = (
			<BlockControls>
				{ editButton }
			</BlockControls>
		);

		const classes = classnames( className, {
			'can-resize': ! isResized,
			'is-transient': isBlobURL( url ),
			'in-progress': inProgress,
		} );

		const inspectorControls = (
			<InspectorControls>
				<PanelBody title="Wallpaper Settings">
					<p>For best results please use an image at least 5120x2880 (Desktop) or 1440x2560 (Mobile).</p>
					<SelectControl
						label="Wallpaper Type"
						value={ type }
						options={ TYPE_OPTIONS }
						onChange={ this.onSelectType }
					/>
				</PanelBody>
			</InspectorControls>
		);

		return (
			<>
				{ noticeUI }
				{ controls }
				{ inspectorControls }
				<figure className={ classes }>
					{ inProgress && <div className="progress-notice">Resizing…</div> }
					{ isBlobURL( url ) && <Spinner /> }
					{ ! hideResizeButton && resizeButton }
					<img src={ url } alt="" />
				</figure>
			</>
		)
	}
}

export default compose( [
	withNotices,
] )( Edit );
