<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'db_tejero');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

define('WP_MEMORY_LIMIT', '256M' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'pj.Mkuv^[M/[[0OJ9LI.ZgF|M!,5gK5;E-fkV%ckYMA(K0jS{0ewxu*pXo|-|eA$');
define('SECURE_AUTH_KEY',  'G({4:@<P-c`!FhjyXJ(NjPDQ}-xoId[8?-Y7q{s+_o9O:W([obob:@{)g#V(Ichh');
define('LOGGED_IN_KEY',    'xum[ADC$82& fAyRk9voLA:F--`}Kl6/qYBDiBAp~W8IbiUe,8;rY-e2`@@su:@^');
define('NONCE_KEY',        'q_[2m>< NZFx}N)w%$y?LLw,`Fxv)O*8l2I.XS$]>@1mm:yL6ubR&3P|@:=/Qd6p');
define('AUTH_SALT',        'eb6roe/qW.7[_a#DkaBfaTjz)/0toH6q:)8~DpcZS]xcD`jdN+Ea>Y,1@?}KMg7T');
define('SECURE_AUTH_SALT', '&{ZTXBfZ%VXKgx ._gZe.v!&Pxp6_YReXIcsotCt!>;D2nqNcyhDsAhKr&1SFqrF');
define('LOGGED_IN_SALT',   '2<>D R$WAe!a_t4q<>RU:bI5g.Tvvr)0sQ8mVZB$+~+s[RnB6dixC1fnj2D[63PV');
define('NONCE_SALT',       'Z5v%D#H=/M%34&>f.gJNK*BR~CO1]@>rb!,p!l{4V?/X1{D+5<Vo^Wmm$~&n2!j0');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
