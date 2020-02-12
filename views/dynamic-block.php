<div class="wp-block-sortabrilliant-dapper-desktop">
	<figure>
		<img src="<?php echo esc_url( $data['url'] ); ?>" class="wp-image-<?php echo (int) $data['id']; ?>">
	</figure>

	<?php if ( ! empty( $data['sizes'] ) ) : ?>
		<div class="download">
			<button class="download__button">Download</button>
			<div class="download__popover">
				<div class="download__popover-inner">
				<?php foreach ( $data['sizes'] as $name => $values ) : ?>
					<p>
						<span><?php echo $name; ?></span>
						<a href="<?php echo esc_url( $values['url'] ); ?>" download><?php echo $values['size']; ?></a>
					</p>
				<?php endforeach; ?>
				</div>
			</div>
		</div>
	<?php endif; ?>
</div>
