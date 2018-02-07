<?php
/*
Template Name: Blog Posts
*/

get_header(); ?>

	<div id="content">
		<div style="height:50vh">
			&nbsp;
		</div>

		<div <?php stratum_attr( 'content-sidebar-wrap' ); ?>>
			<div id="primary"<?php stratum_attr( 'content-area' ); ?> style="color: #333 !important;">

				<?php query_posts('post_type=post&post_status=publish&posts_per_page=10&paged='. get_query_var('paged')); ?>

			<?php if( have_posts() ): ?>

				<?php while( have_posts() ): the_post(); ?>

				<div id="post-<?php get_the_ID(); ?>" <?php post_class(); ?> style="border-bottom:  #EED 1px solid;">

					<a href="<?php the_permalink(); ?>"><?php the_post_thumbnail( array(600,620) ); ?></a>

					<p style="margin: 0px !important;"><a href="<?php the_permalink(); ?>" style="color: #333 !important; font-size: 0.8em;"><?php the_date(); ?></a></p>
					<h2><a href="<?php the_permalink(); ?>" style="text-transform: uppercase;color: #028f60 !important;"><?php the_title(); ?></a></h2>

				<?php the_excerpt(__('Continue reading »','example')); ?>

				</div><!-- /#post-<?php get_the_ID(); ?> -->
				<br>

				<?php endwhile; ?>

				<div class="navigation">
					<span class="newer"><?php previous_posts_link(__('« Newer','example')) ?></span> <span class="older"><?php next_posts_link(__('Older »','example')) ?></span>
				</div><!-- /.navigation -->

			<?php else: ?>

				<div id="post-404" class="noposts">

					<p><?php _e('None found.','example'); ?></p>

				</div><!-- /#post-404 -->

			<?php endif; wp_reset_query(); ?>

			</div>
		</div>
	</div><!-- /#content -->

<?php get_footer(); ?>