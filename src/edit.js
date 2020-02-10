/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { isBlobURL } from '@wordpress/blob';
import {
	BlockControls,
	BlockIcon,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck
} from '@wordpress/block-editor';
import { Component } from '@wordpress/element';
import { IconButton, Spinner, Toolbar, withNotices } from '@wordpress/components';
import { compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import resizeImageRequest from './api';

const ALLOWED_MEDIA_TYPES = [ 'image' ];

class Edit extends Component {
	constructor( { attributes } ) {
		super( ...arguments );
		this.resizeImage = this.resizeImage.bind( this );
		this.onUploadError = this.onUploadError.bind( this );
		this.onSelectImage = this.onSelectImage.bind( this );

		this.state = {
			isEditing: ! attributes.url,
			isResizing: null,
		};
	}

	resizeImage() {
		const { attributes, noticeOperations } = this.props;
		const { id } = attributes;

		this.setState( { isResizing: true } );
		noticeOperations.removeAllNotices();

		resizeImageRequest( id )
			.then( () => {
				this.setState( { isResizing: null } );
			} )
			.catch( ( error ) => {
				noticeOperations.createErrorNotice( error.message );
				this.setState( { isResizing: null } );
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
			} );
			return;
		}

		this.setState( {
			isEditing: false,
		} );


		this.props.setAttributes( {
			id: media.id,
			url: media.url,
		} );
	}

	render() {
		const { isEditing, isResizing } = this.state;
		const { attributes, className, noticeUI } = this.props;
		const { id, url } = attributes;

		if ( isEditing || ! url ) {
			return (
				<>
					<MediaPlaceholder
						icon={ <BlockIcon icon="images-alt2" /> }
						onSelect={ this.onSelectImage }
						notices={ noticeUI }
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

		const resizeButton = (
			<>
				<Toolbar>
					<IconButton
						className="components-toolbar__control"
						label="Resize image"
						icon="image-crop"
						disabled={ isResizing }
						onClick={ this.resizeImage }
					/>
				</Toolbar>
			</>
		);

		const controls = (
			<BlockControls>
				{ editButton }
				{ resizeButton }
			</BlockControls>
		);

		const classes = classnames( className, {
			'is-transient': isBlobURL( url ),
			'is-resizing': isResizing,
		} );

		return (
			<>
				{ noticeUI }
				{ controls }
				<figure className={ classes }>
					{ isResizing && <div className="resizing-notice">Resizing…</div> }
					{ isBlobURL( url ) && <Spinner /> }
					<img src={ url } alt="" />
				</figure>
			</>
		)
	}
}

export default compose( [
	withNotices,
] )( Edit );
