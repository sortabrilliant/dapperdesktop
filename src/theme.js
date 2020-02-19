( function() {
	const buttons = document.querySelectorAll( '.wp-block-sortabrilliant-dapper-desktop .download__button' );

	function toggleWindowVisibility( content, button, close = true ) {
		content.setAttribute( 'aria-hidden', String( close ) );
		button.setAttribute( 'aria-expanded', String( ! close ) );
	}

	function bindEvents( button ) {
		const parent = button.parentElement;
		const content = parent.querySelector( '.download__popover' );

		button.setAttribute( 'aria-expanded', false );
		content.setAttribute( 'aria-hidden', true );

		button.addEventListener( 'click', function() {
			const isOpen = content.getAttribute( 'aria-hidden' ) === 'false';

			toggleWindowVisibility( content, button, isOpen );
		} );

		window.addEventListener( 'click', function( event ) {
			if ( event.target === button || content.contains( event.target ) ) {
				return;
			}

			toggleWindowVisibility( content, button, true );
		} );

		window.addEventListener( 'keydown', function( event ) {
			if ( event.key === 'Escape' ) {
				toggleWindowVisibility( content, button, true );
			}
		} );
	}

	if ( buttons.length ) {
		buttons.forEach( bindEvents );
	}
} )();
